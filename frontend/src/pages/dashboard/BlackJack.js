import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import routes from "../../routes/index";
import { toastr } from "react-redux-toastr";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input
} from "reactstrap";
import {
  XSquare,
  Plus,
  XCircle
} from "react-feather";
import { useTranslation, Translation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown, faAngleDoubleUp, faAngleDoubleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import $ from 'jquery';
import * as UserService from '../../action/user';
import * as PaymentService from '../../action/payment';

const options1 = {
  animation: false,
  maintainAspectRatio: false,
  tooltips: {
    yAlign: "bottom",
    custom: function(tooltip) {
      if (!tooltip) return;
      // disable displaying the color box;
      tooltip.displayColors = false;
    },
    callbacks: {
      // use label callback to return the desired label
      label: function(tooltipItem, data) {
        return tooltipItem.yLabel;
      },
      // remove title
      title: function(tooltipItem, data) {
        return;
      }
    }
  },
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          display: false,
          drawBorder: false,
        },
        stacked: false,
        ticks: {
          display: false,
          min: 0,
          max: 40
        },
      }
    ],
    xAxes: [
      {
        barPercentage: 0.9,
        categoryPercentage: 0.5,
        stacked: false,
        gridLines: {
          color: "transparent"
        },
      }
    ]
  }
};

const hard_totals_table = [
  ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
  ['17', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ['16', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'R/H', 'R/H', 'R/H'],
  ['15', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'R/H', 'H'],
  ['14', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  ['13', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  ['12', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  ['11', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
  ['10', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  ['9', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  ['8', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H']
]

const soft_totals_table = [
  ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
  ['A,9', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ['A,8', 'S', 'S', 'S', 'S', 'Ds', 'S', 'S', 'S', 'S', 'S'],
  ['A,7', 'Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'],
  ['A,6', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  ['A,5', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  ['A,4', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  ['A,3', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  ['A,2', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H']
]

const pair_splitting_table = [
  ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
  ['A,A', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  ['T,T', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
  ['9,9', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'Y', 'Y', 'N', 'N'],
  ['8,8', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  ['7,7', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N'],
  ['6,6', 'Y/N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N'],
  ['5,5', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
  ['4,4', 'N', 'N', 'N', 'Y/N', 'Y/N', 'N', 'N', 'N', 'N', 'N'],
  ['3,3', 'Y/N', 'Y/N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N'],
  ['2,2', 'Y/N', 'Y/N', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N']
]

const surrender_table = [
  ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
  ['16', '', '', '', '', '', '', '', 'SUR', 'SUR', 'SUR'],
  ['15', '', '', '', '', '', '', '', '', 'SUR', ''],
  ['14', '', '', '', '', '', '', '', '', '', '']
]

class Default extends Component
{
  nCards = 52;
  nCardsSum = 0;
  isNextStep = false;
  newPersonSession = false;
  hard_totals_index = -1;
  soft_totals_index = -1;
  pair_splitting_index = -1;
  surrender_index = -1;
  cell_index = -1;
  hard_totals_flag = false;
  soft_totals_flag = false;
  pair_splitting_flag = false;
  surrender_flag = false;
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: false,
      bar_status: false,
      currentSelectPersonID: null,
      currentCardGroupID: null,
      isCardSelectModalOpen: false,
      isCardsDeckStatus: false,
      isGameRowModalOpen: false,
      isResetModalOpen: false,
      isNewModalOpen: false,
      isBlockBtnModalOpen: false,
      isRename: false,
      barChart: {
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "ACE"],
        datasets: [
          {
            displays: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "ACE"],
            backgroundColor: ["#618F33", "#F22F2A", "#FC7271", "#94B535", "#738DD0", "#C4C4C4", "#C4C4C4", "#C4C4C4", "#569640", "#7D4443", "#1755FB", "#A2066F", "#1B6EA5"],
            borderColor: ["#618F33", "#F22F2A", "#FC7271", "#94B535", "#738DD0", "#C4C4C4", "#C4C4C4", "#C4C4C4", "#569640", "#7D4443", "#1755FB", "#A2066F", "#1B6EA5"],
            hoverBackgroundColor: ["#618F33", "#F22F2A", "#FC7271", "#94B535", "#738DD0", "#C4C4C4", "#C4C4C4", "#C4C4C4", "#569640", "#7D4443", "#1755FB", "#A2066F", "#1B6EA5"],
            hoverBorderColor: ["#618F33", "#F22F2A", "#FC7271", "#94B535", "#738DD0", "#C4C4C4", "#C4C4C4", "#C4C4C4", "#569640", "#7D4443", "#1755FB", "#A2066F", "#1B6EA5"],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      nDecksValue: 8,
      nStepCount: 0,
      nRemainingDecks: 0,
      nTrueCount: 0,
      person_data: [[0], [0], [0], [0], [0], [0], [0], [0]],
      fetch_table: [],
      game_row: [],
      activeGameName: '',
      title: "Update",
      message: "Hello!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      cards: [
        {
          area: 0,
          data: []
        },
        {
          area: 1,
          data: []
        },
        {
          area: 2,
          data: []
        },
        {
          area: 3,
          data: []
        },
        {
          area: 4,
          data: []
        },
        {
          area: 5,
          data: []
        },
        {
          area: 6,
          data: []
        },
        {
          area: 7,
          data: []
        },
      ],
      show_notification: true,
      bar_message: '',
      enable_bar_click: false,
      on_click_go_to: '',
      open_in_a_new_tab: false,
      show_button: false,
      button_text: '',
      button_color: '#000000',
      button_text_color: '#FFFFFF',
      show_discount_code: false,
      discount_code: '',
      text_color: '#FFFFFF',
      coupon_code_color: '#FFFFFF',
      background_left_color: '#000000',
      background_right_color: '#FFFFFF',
      show_shadow: false,
      notification_style: {backgroundImage: 'linear-gradient(to right, , )'},
      message_style: {color: ''},
      discount_btn_style: {border: '1px #FFFFFF dashed', backgroundColor: 'transparent', color: ''},
      button_style: {backgroundColor: '', color: '', borderColor: ''},
      close_style: {color: '', cursor: 'pointer'},
      notification_time: ''
    };
  }

  componentWillUnmount() {
  }

  componentWillMount() {
    /* Open collapse element that matches current url */
    const pathName = this.props.location.pathname;

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      const isOpen = route.open;
      const isHome = route.containsHome && pathName === "/" ? true : false;

      this.setState(() => ({
        [index]: isActive || isOpen || isHome
      }));
    });
  }

  async componentDidMount() {
    this.getExpiredDate();
    let game_row = window.localStorage.getItem('game_row');
    if (window.localStorage.getItem('new_game_status')) {
      this.newPersonSession = true;
    } else {
      this.newPersonSession = false;
    }
    let barChart = this.state.barChart;
    let cards = this.state.cards;
    let tempCards = [];
    let idx = 0;
    game_row = JSON.parse(game_row);
    if (game_row) {
      for (var index = 0; index < game_row.length; index++) {
        if (game_row[index]['active'] == 1) {
          idx = index;
        }
      }
      barChart.datasets[0].data = game_row[idx]['barChart'];
      this.nCardsSum = game_row[idx]['nCardsSum'];
      tempCards = game_row[idx]['cards'];
      if (tempCards.length > 0) {
        cards = cards.filter((card, index) => {
          card.data = tempCards[index];
          if (card.data.length > 0) {
            this.isNextStep = true;
          }
          return card;
        });
      }

      for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
        let tempHardTable = hard_totals_table[hardTableIndex];
        for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
          if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][0]) {
            this.cell_index = tempHardIndex;
          } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][1]) {
            this.hard_totals_index = hardTableIndex;
          }
        }
      }
      for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
        let tempSoftTable = soft_totals_table[softTableIndex];
        for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
          if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == game_row[idx]['fetch_table'][2]) {
            this.soft_totals_index = softTableIndex;
          }
        }
      }
      for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
        let tempPairTable = pair_splitting_table[pairTableIndex];
        for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
          if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == game_row[idx]['fetch_table'][2]) {
            this.pair_splitting_index = pairTableIndex;
          }
        }
      }
      for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
        let tempSurrenderTable = surrender_table[surrenderTableIndex];
        for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
          if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == game_row[idx]['fetch_table'][1]) {
            this.surrender_index = surrenderTableIndex;
          }
        }
      }
      if (this.cell_index > -1 && this.hard_totals_index > -1) {
        this.hard_totals_flag = true;
      }
      if (this.cell_index > -1 && this.soft_totals_index > -1) {
        this.soft_totals_flag = true;
      }
      if (this.cell_index > -1 && this.pair_splitting_index > -1) {
        this.pair_splitting_flag = true;
      }
      if (this.cell_index > -1 && this.surrender_index > -1) {
        this.surrender_flag = true;
      }
      this.setState({
        game_row: game_row,
        barChart: barChart,
        person_data: game_row[idx]['person_data'],
        cards: cards,
        nDecksValue: game_row[idx]['nDecksValue'],
        nStepCount: game_row[idx]['nStepCount'],
        nRemainingDecks: game_row[idx]['nRemainingDecks'],
        nTrueCount: game_row[idx]['nTrueCount'],
        fetch_table: game_row[idx]['fetch_table'],
        bar_status: true,
        type: ''
      })
    }

    try {
      const res = await UserService.get_settings({context: 'Notification'});
      if (res.data.settings.data) {
        let data = JSON.parse(res.data.settings.data);
        let updated_at = new Date(res.data.settings.updated_at);
        let notification_time = window.localStorage.getItem('notification_time');
        if (notification_time) {
          if (parseInt(notification_time, 10) - updated_at.getTime() == 0) {
            this.setState({
              show_notification: false
            })
          }
        }
        this.setState({
          bar_message: data.bar_message,
          enable_bar_click: data.enable_bar_click,
          on_click_go_to: data.on_click_go_to,
          open_in_a_new_tab: data.open_in_a_new_tab,
          show_button: data.show_button,
          button_text: data.button_text,
          button_color: data.button_color,
          button_text_color: data.button_text_color,
          show_discount_code: data.show_discount_code,
          discount_code: data.discount_code,
          text_color: data.text_color,
          coupon_code_color: data.coupon_code_color,
          background_left_color: data.background_left_color,
          background_right_color: data.background_right_color,
          show_shadow: data.show_shadow,
          notification_time: updated_at.getTime()
        })
        if (!data.show_shadow) {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + data.background_left_color + ', ' + data.background_left_color +')'},
            message_style: {color: data.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: data.text_color},
            button_style: {backgroundColor: data.button_color, borderColor: data.button_color, color: data.button_text_color},
            close_style: {color: data.coupon_code_color, cursor: 'pointer'}
          })
        } else {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + data.background_left_color + ', ' + data.background_right_color +')'},
            message_style: {color: data.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: data.text_color},
            button_style: {backgroundColor: data.button_color, borderColor: data.button_color, color: data.button_text_color},
            close_style: {color: data.coupon_code_color, cursor: 'pointer'}
          })
        }
      } else {
        this.setState({
          show_notification: false
        })
        if (!this.state.show_shadow) {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + this.state.background_left_color + ', ' + this.state.background_left_color +')'},
            message_style: {color: this.state.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: this.state.text_color},
            button_style: {backgroundColor: this.state.button_color, borderColor: this.state.button_color, color: this.state.button_text_color},
            close_style: {color: this.state.coupon_code_color, cursor: 'pointer'}
          })
        } else {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + this.state.background_left_color + ', ' + this.state.background_right_color +')'},
            message_style: {color: this.state.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: this.state.text_color},
            button_style: {backgroundColor: this.state.button_color, borderColor: this.state.button_color, color: this.state.button_text_color},
            close_style: {color: this.state.coupon_code_color, cursor: 'pointer'}
          })
        }
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error
      });
    }
  }

  componentDidUpdate() {
    if (this.state.type === 'error') {
      this.showToastr();
    }

    if (this.state.bar_status) {
      this.setState({
        bar_status: false
      })
    }
  }
  
  getExpiredDate = () => {
    let self = this;
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    let user_id = userinfo['id'];
    UserService.get_profile(user_id).then(async(res)=> {
      if (res.data.success) {
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
        userinfo = res.data.userinfo;
        if (userinfo['super_user'] > 1) {
          self.setState({
            isBlockBtnModalOpen: false,
              type: ''
          })
        } else {
          if (userinfo['subscription'] < 2) {
            self.setState({
              isBlockBtnModalOpen: true,
              type: ''
            })
          } else {
            var expired_at = new Date(userinfo['expired_at']);
            var now_date = null;
            try{
              const getTime = await UserService.get_time();
              if (getTime.data.success) {
                now_date = getTime.data.time; // now Server date
                now_date = new Date(now_date)
              }
            }
            catch
            {
              console.log('fail');
              now_date = new Date(); // now Local date
            }
            const diffTime = expired_at - now_date;
            if (diffTime <= 0) {
              if (!userinfo['billingAgreementId']) {
                self.setState({
                  isBlockBtnModalOpen: true,
                  type: ''
                })
              } else {
                PaymentService.get_state({user_id: user_id, billingAgreementId: userinfo['billingAgreementId']}).then(async(res)=> {
                  if (res.data.success) {
                    let send_data = {};
                    if (res.data.result.state === 'Active') {
                      expired_at = new Date(res.data.result.agreement_details.next_billing_date);
                      expired_at = new Date(expired_at).getFullYear() + '-'  + (new Date(expired_at).getMonth() + 1) + '-' + new Date(expired_at).getDate() + ' '  + new Date(expired_at).getHours() + ':' + new Date(expired_at).getMinutes() + ':' + new Date(expired_at).getSeconds();
                      send_data['id'] = user_id;
                      send_data['expired_at'] = expired_at;
            
                      UserService.update_profile(send_data).then(function(res) {
                        if (res.data.success) {
                          self.setState({
                            isBlockBtnModalOpen: false,
                            type: ''
                          })
                          window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
                        } else {
                          console.log('fail');
                        }
                      })
                    } else {
                      self.setState({
                        isBlockBtnModalOpen: true,
                        type: ''
                      })
                      send_data['id'] = user_id;
                      send_data['subscription'] = 0;
                      UserService.update_profile(send_data).then(function(res) {
                        if (res.data.success) {
                          window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
                        } else {
                          console.log('fail');
                        }
                      })
                    }
                  } else {
                    console.log('fail');
                  }
                })
              }
            } else {
              self.setState({
                isBlockBtnModalOpen: false,
                type: ''
              })
            }
          }
        }
      } else {
        console.log('fail');
      }
    })
  }

  showToastr = () => {
    const options = {
      timeOut: parseInt(this.state.timeOut),
      showCloseButton: this.state.showCloseButton,
      progressBar: this.state.progressBar,
      position: this.state.position
    };

    const toastrInstance =
      this.state.type === "error"
        ? toastr.error
        : toastr.success;

    toastrInstance(
      this.state.title,
      this.state.message,
      options
    );
  }

  onToggleIn = (area, idx) => {
    this.setState({
      currentSelectPersonID: area,
      currentCardGroupID: idx,
      isCardSelectModalOpen: true,
      type: ''
    })
  }

  onToggleOut = () => {
    this.setState({
      isCardSelectModalOpen: false,
      isGameRowModalOpen: false,
      isResetModalOpen: false,
      isNewModalOpen: false,
      type: ''
    })
  }

  onClickCard = (value, key) => {
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let personID = this.state.currentSelectPersonID;
    let cardGroupID = this.state.currentCardGroupID;
    let game_row = this.state.game_row;
    let barChart = this.state.barChart;
    let person_data = this.state.person_data;
    let cards = this.state.cards;
    let tempCards = [];
    let tempCard = [];
    let fetch_table = this.state.fetch_table;

    cards = cards.filter((cardGroups) => {
      if (cardGroups.area == personID) {
        if (cardGroups.data.length) {
          cardGroups.data.filter((cardGroup, index) => {
            if (index == cardGroupID) {
              tempCard = [...cardGroup];
              cardGroup.push(key);
            }
            return cardGroup;
          })
        } else {
          let cardGroup = [key];
          cardGroups.data.push(cardGroup);
        }
      }
      tempCards.push(cardGroups.data);
      return cardGroups;
    });
    barChart.datasets[0].data[value] += 1;
    if (value < 5) {
      this.nCardsSum = this.nCardsSum + 1;
    } else if (value > 7) {
      this.nCardsSum = this.nCardsSum - 1;
    }
    if (value < 8) {
      value += 2;
    } else if (value == 12) {
      value = 1;
    } else {
      value = 10;
    }
    
    let person_data_ace_array = null;
    let string = null;
    if (person_data[personID][cardGroupID]) {
      person_data_ace_array = (person_data[personID][cardGroupID] + '').split('/');
    } else {
      person_data_ace_array = [0];
    }
    if (tempCard.length) {
      let flgAce = false;
      let nAce = 0;
      for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
        if (tempCard[tempCardIndex] == 'A') {
          flgAce = true;
          nAce++;
        }
      }
      if (flgAce) {
        if (nAce > 1) {
          if (person_data_ace_array.length > 1) {
            if (value == 1) {
              string = parseInt(person_data_ace_array[1], 10) + value + 10;
            } else if (value == 10) {
              string = parseInt(person_data_ace_array[1], 10) + value;
            } else {
              string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[1], 10) + value);
            }
          } else {
            if (value == 1) {
              string = parseInt(person_data_ace_array[0], 10) + value + 10;
            } else {
              string = parseInt(person_data_ace_array[0], 10) + value;
            }
          }
        } else {
          if (value == 1) {
            if (parseInt(person_data_ace_array[0], 10) > 9) {
              string = parseInt(person_data_ace_array[0], 10) + value + 10
            } else {
              string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[0], 10) + value + 10);
            }
          } else if (value == 10) {
            if (tempCard.length == 1) {
              string = parseInt(person_data_ace_array[1], 10) + value;
            } else {
              string = 0;
              for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
                if (tempCard[tempCardIndex] == 'A') {
                  string += 1;
                } else {
                  if (tempCard[tempCardIndex] == 'J' || tempCard[tempCardIndex] == 'Q' || tempCard[tempCardIndex] == 'K') {
                    string += 10;
                  } else {
                    string += parseInt(tempCard[tempCardIndex], 10);
                  }
                }
              }
              string += value;
            }
          } else {
            if (parseInt(person_data_ace_array[0], 10) + value > 11) {
              string = 0;
              for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
                if (tempCard[tempCardIndex] == 'A') {
                  string += 1;
                } else {
                  if (tempCard[tempCardIndex] == 'J' || tempCard[tempCardIndex] == 'Q' || tempCard[tempCardIndex] == 'K') {
                    string += 10;
                  } else {
                    string += parseInt(tempCard[tempCardIndex], 10);
                  }
                }
              }
              string += value;
            } else if (parseInt(person_data_ace_array[0], 10) + value == 11) {
              string = parseInt(person_data_ace_array[1], 10) + value;
            } else {
              string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[1], 10) + value);
            }
          }
        }
      } else {
        if (value == 1) {
          if (parseInt(person_data_ace_array[0], 10) > 10) {
            string = parseInt(person_data_ace_array[0], 10) + value;
          } else if (parseInt(person_data_ace_array[0], 10) == 10) {
            string = parseInt(person_data_ace_array[0], 10) + value + 10;
          } else {
            string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[0], 10) + value + 10);
          }
        } else {
          string = parseInt(person_data_ace_array[0], 10) + value;
        }
      }
    } else {
      if (key == 'A') {
        string = value + '/' + (value + 10);
      } else {
        string = value;
      }
    }
    person_data[personID][cardGroupID] = string;

    if (personID == 0) {
      if (!fetch_table[0]) {
        fetch_table[0] = (key == 'J' || key == 'Q' || key == 'K') ? '10' : key;
      }
    } else if (personID == 7) {
      let string_array = (string + '').split('/');
      if (string_array.length > 1) {
        fetch_table[1] = parseInt(string_array[0], 10) < 8 ? string[1] : string[0];
      } else {
        fetch_table[1] = string;
      }
      if (fetch_table[2]) {
        if (key == 'A') {
          fetch_table[2] = key + ',' + fetch_table[2];
        } else {
          fetch_table[2] = fetch_table[2] + ',' + ((key == '10' || key == 'J' || key == 'Q' || key == 'K') ? 'T' : key);
        }
      } else {
        fetch_table[2] = (key == '10' || key == 'J' || key == 'Q' || key == 'K') ? 'T' : key;
      }
    }

    for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
      let tempHardTable = hard_totals_table[hardTableIndex];
      for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
        if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[0]) {
          this.cell_index = tempHardIndex;
        } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[1]) {
          this.hard_totals_index = hardTableIndex;
        }
      }
    }
    for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
      let tempSoftTable = soft_totals_table[softTableIndex];
      for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
        if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == fetch_table[2]) {
          this.soft_totals_index = softTableIndex;
        }
      }
    }
    for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
      let tempPairTable = pair_splitting_table[pairTableIndex];
      for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
        if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == fetch_table[2]) {
          this.pair_splitting_index = pairTableIndex;
        }
      }
    }
    for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
      let tempSurrenderTable = surrender_table[surrenderTableIndex];
      for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
        if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == fetch_table[1]) {
          this.surrender_index = surrenderTableIndex;
        }
      }
    }
    if (this.cell_index > -1 && this.hard_totals_index > -1) {
      this.hard_totals_flag = true;
    }
    if (this.cell_index > -1 && this.soft_totals_index > -1) {
      this.soft_totals_flag = true;
    }
    if (this.cell_index > -1 && this.pair_splitting_index > -1) {
      this.pair_splitting_flag = true;
    }
    if (this.cell_index > -1 && this.surrender_index > -1) {
      this.surrender_flag = true;
    }

    let nDecksValue = this.state.nDecksValue;
    let nDisplayCards = 0
    let nRemainingDecks = 0
    let nTrueCount = 0;
    for(var barChart_index = 0; barChart_index < barChart.datasets[0].data.length; barChart_index++) {
      nDisplayCards += barChart.datasets[0].data[barChart_index];
    }
    nRemainingDecks = (nDecksValue * this.nCards - nDisplayCards) / this.nCards;
    nTrueCount = this.nCardsSum / nRemainingDecks;
    nRemainingDecks = nRemainingDecks.toFixed(2);
    nTrueCount = nTrueCount.toFixed(2);

    for (var index = 0; index < game_row.length; index++) {
      if (game_row[index]['active'] == 1) {
        game_row[index]['barChart'] = barChart.datasets[0].data;
        game_row[index]['person_data'] = person_data;
        game_row[index]['nDecksValue'] = nDecksValue;
        game_row[index]['nStepCount'] = this.state.nStepCount;
        game_row[index]['nRemainingDecks'] = nRemainingDecks;
        game_row[index]['nTrueCount'] = nTrueCount;
        game_row[index]['nCardsSum'] = this.nCardsSum;
        game_row[index]['cards'] = tempCards;
        game_row[index]['fetch_table'] = fetch_table;
      }
    }
    
    this.setState({
      game_row: game_row,
      cards: cards,
      barChart: barChart,
      person_data: person_data,
      fetch_table: fetch_table,
      nRemainingDecks: nRemainingDecks,
      nTrueCount: nTrueCount,
      bar_status: true,
      type: ''
    })
    this.isNextStep = true;
    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  onDragStart = (ev, value, key) => {
    ev.dataTransfer.setData("key", key);
    ev.dataTransfer.setData("value", value);
    if (this.state.game_row.length > 0) {
      ev.dataTransfer.setData("status", true);
    } else {
      ev.dataTransfer.setData("status", false);
    }
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onDrop = (ev, personID, cardGroupID) => {
    let key = ev.dataTransfer.getData("key");
    let value = parseInt(ev.dataTransfer.getData("value"), 10);
    let status = ev.dataTransfer.getData("status");
    if (status) {
      this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
      this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
      // ev.dataTransfer.setData("status", false);
      let game_row = this.state.game_row;
      let barChart = this.state.barChart;
      let cards = this.state.cards;
      let person_data = this.state.person_data;
      let fetch_table = this.state.fetch_table;
      let tempCards = [];
      let tempCard = [];

      cards = cards.filter((cardGroups) => {
        if (cardGroups.area == personID) {
          if (cardGroups.data.length) {
            cardGroups.data.filter((cardGroup, index) => {
              if (index == cardGroupID) {
                tempCard = [...cardGroup];
                cardGroup.push(key);
              }
              return cardGroup;
            })
          } else {
            let cardGroup = [key];
            cardGroups.data.push(cardGroup);
          }
        }
        tempCards.push(cardGroups.data);
        return cardGroups;
      });

      barChart.datasets[0].data[value] += 1;
      if (value < 5) {
        this.nCardsSum = this.nCardsSum + 1;
      } else if (value > 7) {
        this.nCardsSum = this.nCardsSum - 1;
      }
  
      if (value < 8) {
        value += 2;
      } else if (value == 12) {
        value = 1;
      } else {
        value= 10;
      }
      
      let person_data_ace_array = null;
      let string = null;
      if (person_data[personID][cardGroupID]) {
        person_data_ace_array = (person_data[personID][cardGroupID] + '').split('/');
      } else {
        person_data_ace_array = [0];
      }
      
      if (tempCard.length) {
        let flgAce = false;
        let nAce = 0;
        for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
          if (tempCard[tempCardIndex] == 'A') {
            flgAce = true;
            nAce++;
          }
        }
        if (flgAce) {
          if (nAce > 1) {
            if (person_data_ace_array.length > 1) {
              if (value == 1) {
                string = parseInt(person_data_ace_array[1], 10) + value + 10;
              } else if (value == 10) {
                string = parseInt(person_data_ace_array[1], 10) + value;
              } else {
                string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[1], 10) + value);
              }
            } else {
              if (value == 1) {
                string = parseInt(person_data_ace_array[0], 10) + value + 10;
              } else {
                string = parseInt(person_data_ace_array[0], 10) + value;
              }
            }
          } else {
            if (value == 1) {
              if (parseInt(person_data_ace_array[0], 10) > 9) {
                string = parseInt(person_data_ace_array[0], 10) + value + 10
              } else {
                string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[0], 10) + value + 10);
              }
            } else if (value == 10) {
              if (tempCard.length == 1) {
                string = parseInt(person_data_ace_array[1], 10) + value;
              } else {
                string = 0;
                for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
                  if (tempCard[tempCardIndex] == 'A') {
                    string += 1;
                  } else {
                    if (tempCard[tempCardIndex] == 'J' || tempCard[tempCardIndex] == 'Q' || tempCard[tempCardIndex] == 'K') {
                      string += 10;
                    } else {
                      string += parseInt(tempCard[tempCardIndex], 10);
                    }
                  }
                }
                string += value;
              }
            } else {
              if (parseInt(person_data_ace_array[0], 10) + value > 11) {
                string = 0;
                for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
                  if (tempCard[tempCardIndex] == 'A') {
                    string += 1;
                  } else {
                    if (tempCard[tempCardIndex] == 'J' || tempCard[tempCardIndex] == 'Q' || tempCard[tempCardIndex] == 'K') {
                      string += 10;
                    } else {
                      string += parseInt(tempCard[tempCardIndex], 10);
                    }
                  }
                }
                string += value;
              } else if (parseInt(person_data_ace_array[0], 10) + value == 11) {
                string = parseInt(person_data_ace_array[1], 10) + value;
              } else {
                string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[1], 10) + value);
              }
            }
          }
        } else {
          if (value == 1) {
            if (parseInt(person_data_ace_array[0], 10) > 10) {
              string = parseInt(person_data_ace_array[0], 10) + value;
            } else if (parseInt(person_data_ace_array[0], 10) == 10) {
              string = parseInt(person_data_ace_array[0], 10) + value + 10;
            } else {
              string = (parseInt(person_data_ace_array[0], 10) + value) + '/' + (parseInt(person_data_ace_array[0], 10) + value + 10);
            }
          } else {
            string = parseInt(person_data_ace_array[0], 10) + value;
          }
        }
      } else {
        if (key == 'A') {
          string = value + '/' + (value + 10);
        } else {
          string = value;
        }
      }
      person_data[personID][cardGroupID] = string;
  
      if (personID == 0) {
        if (!fetch_table[0]) {
          fetch_table[0] = (key == 'J' || key == 'Q' || key == 'K') ? '10' : key;
        }
      } else if (personID == 7) {
        let string_array = (string + '').split('/');
        if (string_array.length > 1) {
          fetch_table[1] = parseInt(string_array[0], 10) < 8 ? string[1] : string[0];
        } else {
          fetch_table[1] = string;
        }
        if (fetch_table[2]) {
          if (key == 'A') {
            fetch_table[2] = key + ',' + fetch_table[2];
          } else {
            fetch_table[2] = fetch_table[2] + ',' + ((key == '10' || key == 'J' || key == 'Q' || key == 'K') ? 'T' : key);
          }
        } else {
          fetch_table[2] = (key == '10' || key == 'J' || key == 'Q' || key == 'K') ? 'T' : key;
        }
      }

      for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
        let tempHardTable = hard_totals_table[hardTableIndex];
        for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
          if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[0]) {
            this.cell_index = tempHardIndex;
          } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[1]) {
            this.hard_totals_index = hardTableIndex;
          }
        }
      }
      for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
        let tempSoftTable = soft_totals_table[softTableIndex];
        for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
          if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == fetch_table[2]) {
            this.soft_totals_index = softTableIndex;
          }
        }
      }
      for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
        let tempPairTable = pair_splitting_table[pairTableIndex];
        for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
          if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == fetch_table[2]) {
            this.pair_splitting_index = pairTableIndex;
          }
        }
      }
      for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
        let tempSurrenderTable = surrender_table[surrenderTableIndex];
        for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
          if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == fetch_table[1]) {
            this.surrender_index = surrenderTableIndex;
          }
        }
      }
      if (this.cell_index > -1 && this.hard_totals_index > -1) {
        this.hard_totals_flag = true;
      }
      if (this.cell_index > -1 && this.soft_totals_index > -1) {
        this.soft_totals_flag = true;
      }
      if (this.cell_index > -1 && this.pair_splitting_index > -1) {
        this.pair_splitting_flag = true;
      }
      if (this.cell_index > -1 && this.surrender_index > -1) {
        this.surrender_flag = true;
      }

      let nDecksValue = this.state.nDecksValue;
      let nDisplayCards = 0
      let nRemainingDecks = 0
      let nTrueCount = 0;
      for(var barChart_index = 0; barChart_index < barChart.datasets[0].data.length; barChart_index++) {
        nDisplayCards += barChart.datasets[0].data[barChart_index];
      }
      nRemainingDecks = (nDecksValue * this.nCards - nDisplayCards) / this.nCards;
      nTrueCount = this.nCardsSum / nRemainingDecks;
      nRemainingDecks = nRemainingDecks.toFixed(2);
      nTrueCount = nTrueCount.toFixed(2);

      for (var index = 0; index < game_row.length; index++) {
        if (game_row[index]['active'] == 1) {
          game_row[index]['barChart'] = barChart.datasets[0].data;
          game_row[index]['person_data'] = person_data;
          game_row[index]['nDecksValue'] = nDecksValue;
          game_row[index]['nStepCount'] = this.state.nStepCount;
          game_row[index]['nRemainingDecks'] = nRemainingDecks;
          game_row[index]['nTrueCount'] = nTrueCount;
          game_row[index]['nCardsSum'] = this.nCardsSum;
          game_row[index]['cards'] = tempCards;
          game_row[index]['fetch_table'] = fetch_table;
        }
      }
      
      this.setState({
        game_row: game_row,
        cards: cards,
        barChart: barChart,
        person_data: person_data,
        fetch_table: fetch_table,
        nRemainingDecks: nRemainingDecks,
        nTrueCount: nTrueCount,
        bar_status: true,
        type: ''
      })
      this.isNextStep = true;
      window.localStorage.setItem('game_row', JSON.stringify(game_row));
    } else {
      console.log('error');
    }
  }

  nextStep = () => {
    this.onUndoHide();
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let game_row = this.state.game_row;
    let cards = this.state.cards;

    cards = cards.filter((cardGroups) => {
      cardGroups.data = [];
      return cardGroups;
    });

    for (var index = 0; index < game_row.length; index++) {
      if (game_row[index]['active'] == 1) {
        game_row[index]['person_data'] = [[0], [0], [0], [0], [0], [0], [0], [0]];
        game_row[index]['nStepCount'] = this.state.nStepCount + 1;
        game_row[index]['nCardsSum'] = 0;
        game_row[index]['cards'] = cards;
        game_row[index]['fetch_table'] = [];
      }
    }

    this.setState({
      game_row: game_row,
      person_data: [[0], [0], [0], [0], [0], [0], [0], [0]],
      fetch_table: [],
      cards: cards,
      nStepCount: this.state.nStepCount + 1,
      bar_status: true,
      type: ''
    })
    this.nCardsSum = 0;
    this.isNextStep = false;

    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  onResetState = () => {
    this.onUndoHide();
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let cards = this.state.cards.filter((card) => {
      card.data = [];
      return card;
    });
    let barChart = this.state.barChart;
    barChart.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let game_row = this.state.game_row;

    for (var index = 0; index < game_row.length; index++) {
      if (game_row[index]['active'] == 1) {
        game_row[index]['person_data'] = [[0], [0], [0], [0], [0], [0], [0], [0]];
        game_row[index]['barChart'] = [0, 0, 0, 0, 0, 0, 0, 0];
        game_row[index]['nDecksValue'] = 8;
        game_row[index]['nStepCount'] = 0;
        game_row[index]['nRemainingDecks'] = 0;
        game_row[index]['nTrueCount'] = 0;
        game_row[index]['nCardsSum'] = 0;
        game_row[index]['cards'] = [];
        game_row[index]['fetch_table'] = [];
      }
    }

    this.setState({
      game_row: game_row,
      barChart: barChart,
      person_data: [[0], [0], [0], [0], [0], [0], [0], [0]],
      fetch_table: [],
      nDecksValue: 8,
      nStepCount: 0,
      nRemainingDecks: 0,
      nTrueCount: 0,
      cards: cards,
      bar_status: true,
      isResetModalOpen: false,
      type: ''
    })
    this.nCardsSum = 0;
    this.isNextStep = false;

    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  onNewGame = () => {
    this.onUndoHide();
    window.localStorage.setItem('new_game_status', true);
    this.newPersonSession = true;
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    var current_date = new Date();
    let game_row = this.state.game_row;
    let stack = {};
    stack['id'] = parseInt(current_date.getTime() / 1000);
    stack['active'] = 1;
    stack['name'] = 'G-' + parseInt(current_date.getTime() % 100000);
    stack['person_data'] = [[0], [0], [0], [0], [0], [0], [0], [0]];
    stack['barChart'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    stack['nDecksValue'] = 8;
    stack['nStepCount'] = 0;
    stack['nRemainingDecks'] = 0;
    stack['nTrueCount'] = 0;
    stack['nCardsSum'] = 0;
    stack['cards'] = [];
    stack['fetch_table'] = [];
    if (game_row.length) {
      for (var index = 0; index < game_row.length; index++) {
        if (game_row[index]['active'] == 1) {
          game_row[index]['active'] = 0;
          game_row[index]['barChart'] = this.state.barChart.datasets[0].data;
          game_row[index]['person_data'] = this.state.person_data;
          game_row[index]['nDecksValue'] = this.state.nDecksValue;
          game_row[index]['nStepCount'] = this.state.nStepCount;
          game_row[index]['nRemainingDecks'] = this.state.nRemainingDecks;
          game_row[index]['nTrueCount'] = this.state.nTrueCount;
          game_row[index]['nCardsSum'] = this.nCardsSum;
          game_row[index]['fetch_table'] = this.state.fetch_table;
          let cards = this.state.cards;
          let tempCards = [];
          cards = cards.filter((cardGroups) => {
            tempCards.push(cardGroups.data);
            return cardGroups;
          });
          game_row[index]['cards'] = tempCards;
        }
      }
      game_row.splice(0, 0, stack);
    } else {
      game_row.push(stack);
    }
    this.setState({
      game_row: game_row,
      isGameRowModalOpen: false,
      isNewModalOpen: false,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('game_row', JSON.stringify(game_row));
    this.onResetState(); 
  }

  onActiveGame = (idx) => {
    this.onUndoHide();
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let game_row = this.state.game_row;
    if (game_row.length) {
      let cards = this.state.cards;
      let barChart = this.state.barChart;
      let tempCards = [];
      for (var index = 0; index < game_row.length; index++) {
        if (game_row[index]['active'] == 1) {
          game_row[index]['active'] = 0;
          game_row[index]['barChart'] = this.state.barChart.datasets[0].data;
          game_row[index]['person_data'] = this.state.person_data;
          game_row[index]['nDecksValue'] = this.state.nDecksValue;
          game_row[index]['nStepCount'] = this.state.nStepCount;
          game_row[index]['nRemainingDecks'] = this.state.nRemainingDecks;
          game_row[index]['nTrueCount'] = this.state.nTrueCount;
          game_row[index]['nCardsSum'] = this.nCardsSum;
          game_row[index]['fetch_table'] = this.state.fetch_table;
          cards = cards.filter((cardGroups) => {
            tempCards.push(cardGroups.data);
            return cardGroups;
          });
          game_row[index]['cards'] = tempCards;
        }
      }
      game_row[idx]['active'] = 1;
      barChart.datasets[0].data = game_row[idx]['barChart'];
      this.nCardsSum = game_row[idx]['nCardsSum'];
      this.isNextStep = false;
      tempCards = game_row[idx]['cards'];
      cards = cards.filter((card, index) => {
        card.data = tempCards[index];
        if (tempCards[index].length) {
          tempCards[index].filter((cardGroup) => {
            if (cardGroup.length) {
              this.isNextStep = true;
            }
          })
        }
        return card;
      });

      for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
        let tempHardTable = hard_totals_table[hardTableIndex];
        for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
          if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][0]) {
            this.cell_index = tempHardIndex;
          } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][1]) {
            this.hard_totals_index = hardTableIndex;
          }
        }
      }
      for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
        let tempSoftTable = soft_totals_table[softTableIndex];
        for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
          if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == game_row[idx]['fetch_table'][2]) {
            this.soft_totals_index = softTableIndex;
          }
        }
      }
      for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
        let tempPairTable = pair_splitting_table[pairTableIndex];
        for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
          if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == game_row[idx]['fetch_table'][2]) {
            this.pair_splitting_index = pairTableIndex;
          }
        }
      }
      for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
        let tempSurrenderTable = surrender_table[surrenderTableIndex];
        for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
          if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == game_row[idx]['fetch_table'][1]) {
            this.surrender_index = surrenderTableIndex;
          }
        }
      }
      if (this.cell_index > -1 && this.hard_totals_index > -1) {
        this.hard_totals_flag = true;
      }
      if (this.cell_index > -1 && this.soft_totals_index > -1) {
        this.soft_totals_flag = true;
      }
      if (this.cell_index > -1 && this.pair_splitting_index > -1) {
        this.pair_splitting_flag = true;
      }
      if (this.cell_index > -1 && this.surrender_index > -1) {
        this.surrender_flag = true;
      }
      this.setState({
        game_row: game_row,
        barChart: barChart,
        person_data: game_row[idx]['person_data'],
        cards: cards,
        nDecksValue: game_row[idx]['nDecksValue'],
        nStepCount: game_row[idx]['nStepCount'],
        nRemainingDecks: game_row[idx]['nRemainingDecks'],
        nTrueCount: game_row[idx]['nTrueCount'],
        fetch_table: game_row[idx]['fetch_table'],
        bar_status: true,
        type: ''
      })
    } else {
      this.setState({
        game_row: game_row,
        bar_status: true,
        type: ''
      })
    }
    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  onCloseGame = (index) => {
    this.onUndoHide();
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let game_row = this.state.game_row;
    if (game_row[index]['active'] == 0) {
      game_row.splice(index, 1);
      this.setState({
        game_row: game_row,
        bar_status: true,
        type: ''
      })
      window.localStorage.setItem('game_row', JSON.stringify(game_row));
    } else {
      game_row.splice(index, 1);
      if(game_row.length > 0) {
        let idx = game_row.length - 1;
        game_row[idx]['active'] = 1;
        let cards = this.state.cards;
        let barChart = this.state.barChart;
        let tempCards = [];
        barChart.datasets[0].data = game_row[idx]['barChart']

        this.isNextStep = false;
        tempCards = game_row[idx]['cards'];
        cards = cards.filter((card, index) => {
          card.data = tempCards[index];
          if (tempCards[index].length) {
            tempCards[index].filter((cardGroup) => {
              if (cardGroup.length) {
                this.isNextStep = true;
              }
            })
          }
          return card;
        });

        for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
          let tempHardTable = hard_totals_table[hardTableIndex];
          for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
            if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][0]) {
              this.cell_index = tempHardIndex;
            } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == game_row[idx]['fetch_table'][1]) {
              this.hard_totals_index = hardTableIndex;
            }
          }
        }
        for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
          let tempSoftTable = soft_totals_table[softTableIndex];
          for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
            if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == game_row[idx]['fetch_table'][2]) {
              this.soft_totals_index = softTableIndex;
            }
          }
        }
        for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
          let tempPairTable = pair_splitting_table[pairTableIndex];
          for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
            if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == game_row[idx]['fetch_table'][2]) {
              this.pair_splitting_index = pairTableIndex;
            }
          }
        }
        for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
          let tempSurrenderTable = surrender_table[surrenderTableIndex];
          for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
            if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == game_row[idx]['fetch_table'][1]) {
              this.surrender_index = surrenderTableIndex;
            }
          }
        }
        if (this.cell_index > -1 && this.hard_totals_index > -1) {
          this.hard_totals_flag = true;
        }
        if (this.cell_index > -1 && this.soft_totals_index > -1) {
          this.soft_totals_flag = true;
        }
        if (this.cell_index > -1 && this.pair_splitting_index > -1) {
          this.pair_splitting_flag = true;
        }
        if (this.cell_index > -1 && this.surrender_index > -1) {
          this.surrender_flag = true;
        }
        this.setState({
          game_row: game_row,
          barChart: barChart,
          person_data: game_row[idx]['person_data'],
          cards: cards,
          nDecksValue: game_row[idx]['nDecksValue'],
          nStepCount: game_row[idx]['nStepCount'],
          nRemainingDecks: game_row[idx]['nRemainingDecks'],
          nTrueCount: game_row[idx]['nTrueCount'],
          fetch_table: game_row[idx]['fetch_table'],
          bar_status: true,
          type: ''
        })
        this.nCardsSum = game_row[idx]['nCardsSum'];
        window.localStorage.setItem('game_row', JSON.stringify(game_row));
      } else {
        this.setState({
          game_row: game_row,
          bar_status: true,
          type: ''
        })
        this.onResetState();
        window.localStorage.removeItem('game_row');
      }
    }
  }

  onChangeTitleStyle = (index) => {
    let game_row = this.state.game_row;
    this.setState({
      activeGameName: game_row[index]['name'],
      isRename: true
    })
  }

  handleChange = (name, value) => {
    if (name === 'game_name') {
      this.setState({
        activeGameName: value,
        type: ''
      })
    }
  }

  keyPress = (e) => {
    if (e.keyCode === 13) {
      this.onUpdateGameName();
    }
  }

  onUpdateGameName = () => {
    if (!this.state.activeGameName) {
      this.setState({
        type: "error",
        message: "Please Insert Game Name!"
      });
      return;
    }
    let game_row = this.state.game_row;
    if (game_row) {
      for (var index = 0; index < game_row.length; index++) {
        if (game_row[index]['active'] === 1) {
          game_row[index]['name'] = this.state.activeGameName;
        }
      }
      this.setState({
        game_row: game_row
      })
      window.localStorage.setItem('game_row', JSON.stringify(game_row));
    }
    this.setState({
      isRename: false,
      bar_status: true,
      type: ''
    })
  }

  onUndoHide = () => {
    $('.undo-group').addClass('undo-group-hidden');
    $('.undo-group').removeClass('undo-group-show');
  }

  onUndoHideShow = (area, index) => {
    if ($('.undo-group-' + area + '-' + index).closest('.undo-group').hasClass('undo-group-hidden')) {
      $('.undo-group-' + area + '-' + index).closest('.undo-group').removeClass('undo-group-hidden');
      $('.undo-group-' + area + '-' + index).closest('.undo-group').addClass('undo-group-show');
    } else {
      $('.undo-group-' + area + '-' + index).closest('.undo-group').addClass('undo-group-hidden');
      $('.undo-group-' + area + '-' + index).closest('.undo-group').removeClass('undo-group-show');
    }
  }

  onRemoveCard = (area, cardGroupID, cardIdx) => {
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let personID = area;
    let key = '';
    let value = -1;
    let string = 0;
    let game_row = this.state.game_row;
    let barChart = this.state.barChart;
    let person_data = this.state.person_data;
    let cards = this.state.cards;
    let tempCards = [];
    let tempCard = [];
    let fetch_table = this.state.fetch_table;

    cards = cards.filter((cardGroups) => {
      if (cardGroups.area == personID) {
        cardGroups.data.filter((cardGroup, index) => {
          if (index == cardGroupID) {
            key = cardGroup[cardIdx];
            cardGroup.splice(cardIdx, 1);
            tempCard = [...cardGroup];
          }
          return cardGroup;
        })
      }
      tempCards.push(cardGroups.data);
      return cardGroups;
    });

    if (!Number(parseInt(key, 10))) {
      if (key == 'J') {
        value = 9;
      } else if (key == 'Q') {
        value = 10;
      } else if (key == 'K') {
        value = 11;
      } else if (key == 'A') {
        value = 12;
      }
    } else {
      value = parseInt(key, 10) - 2;
    }
    barChart.datasets[0].data[value] -= 1;
    if (value < 5) {
      this.nCardsSum = this.nCardsSum - 1;
    } else if (value > 7) {
      this.nCardsSum = this.nCardsSum + 1;
    }
    value = 1;
    if (tempCard.length) {
      let flgAce = false;
      let nAce = 0;
      for (var tempCardIndex = 0; tempCardIndex < tempCard.length; tempCardIndex++) {
        if (tempCard[tempCardIndex] == 'A') {
          flgAce = true;
          nAce++;
        } else {
          if (tempCard[tempCardIndex] == 'J' || tempCard[tempCardIndex] == 'Q' || tempCard[tempCardIndex] == 'K') {
            string += 10;
          } else {
            string += parseInt(tempCard[tempCardIndex], 10);
          }
        }
      }
      if (flgAce) {
        if (nAce > 2) {
          person_data[personID][cardGroupID] = string + value + (value + 10) * (nAce - 1);
        } else if (nAce == 2) {
          if (string > 8) {
            person_data[personID][cardGroupID] = string + (value * nAce) + 10;
          } else {
            person_data[personID][cardGroupID] = (string + value * nAce) + '/' + (string + (value * nAce) + 10);
          }
        } else {
          if (string > 10) {
            person_data[personID][cardGroupID] = string + value;
          } else if (string == 10) {
            person_data[personID][cardGroupID] = string + value + 10;
          } else {
            person_data[personID][cardGroupID] = (string + value) + '/' + (string + value + 10);
          }
        }
      } else {
        person_data[personID][cardGroupID] = string;
      }
    } else {
      person_data[personID][cardGroupID] = string;
      this.onUndoHideShow(personID, cardGroupID);
    }

    string = person_data[personID][cardGroupID];
      
    if (personID == 0) {
      fetch_table[0] = (tempCard[0] == 'J' || tempCard[0] == 'Q' || tempCard[0] == 'K') ? '10' : tempCard[0];
    } else if (personID == 7) {
      let string_array = (string + '').split('/');
      if (string_array.length > 1) {
        fetch_table[1] = parseInt(string_array[0], 10) < 8 ? string[1] : string[0];
      } else {
        fetch_table[1] = string;
      }
      if (tempCard.length > 1) {
        if (tempCard[tempCard.length - 1] == 'A') {
          fetch_table[2] = tempCard[tempCard.length - 1] + ',' + tempCard[tempCard.length - 2];
        } else {
          fetch_table[2] = tempCard[tempCard.length - 2] + ',' + ((tempCard[tempCard.length - 1] == '10' || tempCard[tempCard.length - 1] == 'J' || tempCard[tempCard.length - 1] == 'Q' || tempCard[tempCard.length - 1] == 'K') ? 'T' : tempCard[tempCard.length - 1]);
        }
      } else {
        fetch_table[2] = (tempCard[tempCard.length - 1] == '10' || tempCard[tempCard.length - 1] == 'J' || tempCard[tempCard.length - 1] == 'Q' || tempCard[tempCard.length - 1] == 'K') ? 'T' : tempCard[tempCard.length - 1];
      }
    }

    for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
      let tempHardTable = hard_totals_table[hardTableIndex];
      for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
        if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[0]) {
          this.cell_index = tempHardIndex;
        } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[1]) {
          this.hard_totals_index = hardTableIndex;
        }
      }
    }
    for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
      let tempSoftTable = soft_totals_table[softTableIndex];
      for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
        if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == fetch_table[2]) {
          this.soft_totals_index = softTableIndex;
        }
      }
    }
    for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
      let tempPairTable = pair_splitting_table[pairTableIndex];
      for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
        if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == fetch_table[2]) {
          this.pair_splitting_index = pairTableIndex;
        }
      }
    }
    for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
      let tempSurrenderTable = surrender_table[surrenderTableIndex];
      for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
        if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == fetch_table[1]) {
          this.surrender_index = surrenderTableIndex;
        }
      }
    }
      
    if (this.cell_index > -1 && this.hard_totals_index > -1) {
      this.hard_totals_flag = true;
    }
    if (this.cell_index > -1 && this.soft_totals_index > -1) {
      this.soft_totals_flag = true;
    }
    if (this.cell_index > -1 && this.pair_splitting_index > -1) {
      this.pair_splitting_flag = true;
    }
    if (this.cell_index > -1 && this.surrender_index > -1) {
      this.surrender_flag = true;
    }

    let nDecksValue = this.state.nDecksValue;
    let nDisplayCards = 0
    let nRemainingDecks = 0
    let nTrueCount = 0;
    for(var barChart_index = 0; barChart_index < barChart.datasets[0].data.length; barChart_index++) {
      nDisplayCards += barChart.datasets[0].data[barChart_index];
    }
    nRemainingDecks = (nDecksValue * this.nCards - nDisplayCards) / this.nCards;
    nTrueCount = this.nCardsSum / nRemainingDecks;
    nRemainingDecks = nRemainingDecks.toFixed(2);
    nTrueCount = nTrueCount.toFixed(2);

    for (var index = 0; index < game_row.length; index++) {
      if (game_row[index]['active'] == 1) {
        game_row[index]['barChart'] = barChart.datasets[0].data;
        game_row[index]['person_data'] = person_data;
        game_row[index]['nDecksValue'] = nDecksValue;
        game_row[index]['nStepCount'] = this.state.nStepCount;
        game_row[index]['nRemainingDecks'] = nRemainingDecks;
        game_row[index]['nTrueCount'] = nTrueCount;
        game_row[index]['nCardsSum'] = this.nCardsSum;
        game_row[index]['cards'] = tempCards;
        game_row[index]['fetch_table'] = fetch_table;
      }
    }
    
    this.setState({
      game_row: game_row,
      cards: cards,
      barChart: barChart,
      person_data: person_data,
      fetch_table: fetch_table,
      nRemainingDecks: nRemainingDecks,
      nTrueCount: nTrueCount,
      bar_status: true,
      type: ''
    })
    this.isNextStep = true;
    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  onCardSplit = (personID, cardGroupID) => {
    this.onUndoHideShow(personID, cardGroupID);
    this.hard_totals_index = this.soft_totals_index = this.pair_splitting_index = this.surrender_index = this.cell_index = -1;
    this.hard_totals_flag = this.soft_totals_flag = this.pair_splitting_flag = this.surrender_flag = false;
    let game_row = this.state.game_row;
    let barChart = this.state.barChart;
    let cards = this.state.cards;
    let person_data = this.state.person_data;
    let fetch_table = this.state.fetch_table;
    let tempCards = [];
    let tempCard = [];
    let string = '';

    cards = cards.filter((cardGroups) => {
      if (cardGroups.area == personID) {
        cardGroups.data.filter((cardGroup, index) => {
          if (index == cardGroupID) {
            cardGroup.splice(0, 1);
            tempCard = [...cardGroup];
          }
          return cardGroup;
        })
        cardGroups.data.splice(cardGroupID, 0, tempCard);
      }
      tempCards.push(cardGroups.data);
      return cardGroups;
    });

    if (tempCard[0] == 'J' || tempCard[0] == 'Q' || tempCard[0] == 'K') {
      string = 10;
    } else if (tempCard[0] == 'A') {
      string = '1/11';
    } else {
      string = parseInt(tempCard[0], 10);
    }

    person_data[personID][cardGroupID] = string;
    person_data[personID].splice(cardGroupID, 0, string);
      
    if (personID == 0) {
      fetch_table[0] = (tempCard[0] == 'J' || tempCard[0] == 'Q' || tempCard[0] == 'K') ? '10' : tempCard[0];
    } else if (personID == 7) {
      let string_array = (string + '').split('/');
      if (string_array.length > 1) {
        fetch_table[1] = parseInt(string_array[0], 10) < 8 ? string[1] : string[0];
      } else {
        fetch_table[1] = string;
      }
      if (tempCard.length > 1) {
        if (tempCard[tempCard.length - 1] == 'A') {
          fetch_table[2] = tempCard[tempCard.length - 1] + ',' + tempCard[tempCard.length - 2];
        } else {
          fetch_table[2] = tempCard[tempCard.length - 2] + ',' + ((tempCard[tempCard.length - 1] == '10' || tempCard[tempCard.length - 1] == 'J' || tempCard[tempCard.length - 1] == 'Q' || tempCard[tempCard.length - 1] == 'K') ? 'T' : tempCard[tempCard.length - 1]);
        }
      } else {
        fetch_table[2] = (tempCard[tempCard.length - 1] == '10' || tempCard[tempCard.length - 1] == 'J' || tempCard[tempCard.length - 1] == 'Q' || tempCard[tempCard.length - 1] == 'K') ? 'T' : tempCard[tempCard.length - 1];
      }
    }

    for (var hardTableIndex = 0; hardTableIndex < hard_totals_table.length; hardTableIndex++) {
      let tempHardTable = hard_totals_table[hardTableIndex];
      for (var tempHardIndex = 0; tempHardIndex < tempHardTable.length; tempHardIndex++) {
        if (hardTableIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[0]) {
          this.cell_index = tempHardIndex;
        } else if (tempHardIndex == 0 && tempHardTable[tempHardIndex] == fetch_table[1]) {
          this.hard_totals_index = hardTableIndex;
        }
      }
    }
    for (var softTableIndex = 0; softTableIndex < soft_totals_table.length; softTableIndex++) {
      let tempSoftTable = soft_totals_table[softTableIndex];
      for (var tempSoftIndex = 0; tempSoftIndex < tempSoftTable.length; tempSoftIndex++) {
        if (tempSoftIndex == 0 && tempSoftTable[tempSoftIndex] == fetch_table[2]) {
          this.soft_totals_index = softTableIndex;
        }
      }
    }
    for (var pairTableIndex = 0; pairTableIndex < pair_splitting_table.length; pairTableIndex++) {
      let tempPairTable = pair_splitting_table[pairTableIndex];
      for (var tempPairIndex = 0; tempPairIndex < tempPairTable.length; tempPairIndex++) {
        if (tempPairIndex == 0 && tempPairTable[tempPairIndex] == fetch_table[2]) {
          this.pair_splitting_index = pairTableIndex;
        }
      }
    }
    for (var surrenderTableIndex = 0; surrenderTableIndex < surrender_table.length; surrenderTableIndex++) {
      let tempSurrenderTable = surrender_table[surrenderTableIndex];
      for (var tempSurrenderIndex = 0; tempSurrenderIndex < tempSurrenderTable.length; tempSurrenderIndex++) {
        if (tempSurrenderIndex == 0 && tempSurrenderTable[tempSurrenderIndex] == fetch_table[1]) {
          this.surrender_index = surrenderTableIndex;
        }
      }
    }
      
    if (this.cell_index > -1 && this.hard_totals_index > -1) {
      this.hard_totals_flag = true;
    }
    if (this.cell_index > -1 && this.soft_totals_index > -1) {
      this.soft_totals_flag = true;
    }
    if (this.cell_index > -1 && this.pair_splitting_index > -1) {
      this.pair_splitting_flag = true;
    }
    if (this.cell_index > -1 && this.surrender_index > -1) {
      this.surrender_flag = true;
    }

    let nDecksValue = this.state.nDecksValue;
    let nDisplayCards = 0
    let nRemainingDecks = 0
    let nTrueCount = 0;
    for(var barChart_index = 0; barChart_index < barChart.datasets[0].data.length; barChart_index++) {
      nDisplayCards += barChart.datasets[0].data[barChart_index];
    }
    nRemainingDecks = (nDecksValue * this.nCards - nDisplayCards) / this.nCards;
    nTrueCount = this.nCardsSum / nRemainingDecks;
    nRemainingDecks = nRemainingDecks.toFixed(2);
    nTrueCount = nTrueCount.toFixed(2);

    for (var index = 0; index < game_row.length; index++) {
      if (game_row[index]['active'] == 1) {
        game_row[index]['barChart'] = barChart.datasets[0].data;
        game_row[index]['person_data'] = person_data;
        game_row[index]['nDecksValue'] = nDecksValue;
        game_row[index]['nStepCount'] = this.state.nStepCount;
        game_row[index]['nRemainingDecks'] = nRemainingDecks;
        game_row[index]['nTrueCount'] = nTrueCount;
        game_row[index]['nCardsSum'] = this.nCardsSum;
        game_row[index]['cards'] = tempCards;
        game_row[index]['fetch_table'] = fetch_table;
      }
    }
    
    this.setState({
      game_row: game_row,
      cards: cards,
      barChart: barChart,
      person_data: person_data,
      fetch_table: fetch_table,
      nRemainingDecks: nRemainingDecks,
      nTrueCount: nTrueCount,
      bar_status: true,
      type: ''
    })
    this.isNextStep = true;
    window.localStorage.setItem('game_row', JSON.stringify(game_row));
  }

  none() {
    console.log('Disable go to url.');
  }

  onClickNotify = () => {
    if (this.state.open_in_a_new_tab) {
      window.open(this.state.on_click_go_to, '_blank');
    } else {
      window.open(this.state.on_click_go_to, '_self');
    }
  }

  onHideNotification = (event) => {
    this.setState({
      show_notification: false,
      type: ''
    })
    window.localStorage.setItem('notification_time', this.state.notification_time);
    event.stopPropagation();
  }
  
  render()
  {
    const { sidebar } = this.props;
    let { bar_status, person_data, fetch_table, game_row, isRename, cards, notification_style, message_style, bar_message, show_discount_code, discount_btn_style, discount_code, show_button, button_style, button_text, close_style, show_notification, enable_bar_click } = this.state;
    return(
      <Container fluid className="p-0">
        {
          show_notification && (
            <div className="w-100 d-flex p-3" style={notification_style} onClick={enable_bar_click ? this.onClickNotify : this.none}>
              <div className="mr-auto ml-auto">
                <span className="mt-auto mb-auto mr-3" style={message_style}>{bar_message}</span>
                {
                  show_discount_code && (<Button size="lg" className="mr-3" style={discount_btn_style}>{discount_code}</Button>)
                }
                {
                  show_button && (<Button size="lg" style={button_style} onClick={this.onClickNotify}>{button_text}</Button>)
                }
              </div>
              <XCircle size={20} className="mt-auto mb-auto float-right" style={close_style} onClick={(e) => this.onHideNotification(e)} />
            </div>
          )
        }
        <Row className="m-0 pt-1" style={{backgroundColor: '#1C2B2D'}}>
          <Col>
            <div className="game_slider">
              <div className="game_group">
                {
                  game_row.map((row, index) => {
                    if (index === game_row.length - 1) {
                      if (row.active === 1) {
                        return (
                          <div className="active_last_game" key={index}>
                            {
                              !isRename ? (
                                <>
                                  <span onDoubleClick={() => this.onChangeTitleStyle(index)} onClick={() => this.onActiveGame(index)}>{row.name}</span><XSquare size={20} className="align-middle ml-2" onClick={() => this.onCloseGame(index)} />
                                </>
                              ) : (
                                <Input
                                  bsSize="sm"
                                  type="text"
                                  name="game_name"
                                  placeholder="Input Game Name"
                                  className="game_rename"
                                  value={this.state.activeGameName}
                                  onChange={(e) => {this.handleChange("game_name", e.target.value)}}
                                  onKeyDown={this.keyPress}
                                  onBlur={this.onUpdateGameName}
                                />
                              )
                            }
                          </div>
                        )
                      } else {
                        return (
                          <div className="unactive_last_game" key={index}><span onClick={() => this.onActiveGame(index)}>{row.name}</span><XSquare size={20} className="align-middle ml-2" onClick={() => this.onCloseGame(index)} /></div>
                        )
                      }
                    } else {
                      if (row.active === 1) {
                        return (
                          <div className="active_middle_game" key={index}>
                            {
                              !isRename ? (
                                <>
                                  <span onDoubleClick={() => this.onChangeTitleStyle(index)} onClick={() => this.onActiveGame(index)}>{row.name}</span><XSquare size={20} className="align-middle ml-2" onClick={() => this.onCloseGame(index)} />
                                </>
                              ) : (
                                <Input
                                  bsSize="sm"
                                  type="text"
                                  name="game_name"
                                  placeholder="Input Game Name"
                                  className="game_rename"
                                  value={this.state.activeGameName}
                                  onChange={(e) => {this.handleChange("game_name", e.target.value)}}
                                  onKeyDown={this.keyPress}
                                  onBlur={this.onUpdateGameName}
                                />
                              )
                            }
                          </div>
                        )
                      } else {
                        return (
                          <div className="unactive_middle_game" key={index}><span onClick={() => this.onActiveGame(index)}>{row.name}</span><XSquare size={20} className="align-middle ml-2" onClick={() => this.onCloseGame(index)} /></div>
                        )
                      }
                    }
                  })
                }
                {
                  game_row.length > 0 ? (
                    <div className="last_new_game" onClick={this.onNewGame}>
                      <span key={'1'}><Translation>{(t, { i18n }) => <>{t('NewGame')}</>}</Translation></span>
                      <Plus size={20} className="align-middle ml-2"  />
                    </div>
                  ) : (
                    <div className="first_new_game" onClick={() => this.newPersonSession ? this.onNewGame() : this.setState({isNewModalOpen: true})}>
                      <span key={'1'}><Translation>{(t, { i18n }) => <>{t('NewGame')}</>}</Translation></span>
                      <Plus size={20} className="align-middle ml-2"  />
                    </div>
                  )
                }
              </div>
            </div>
          </Col>
        </Row>
        <div className="d-flex">
          <Row className="m-0 p-3 w-100 blackjack-header">
            <div className="change-slide">
              <div>
                <FontAwesomeIcon
                  className="align-middle change-slide-caret-up"
                  icon={faCaretUp}
                  onClick={() => this.setState({
                    currentSlide: !this.state.currentSlide
                  })}
                />
              </div>
              <div>
                <FontAwesomeIcon
                  className="align-middle change-slide-caret-down"
                  icon={faCaretDown}
                  onClick={() => this.setState({
                    currentSlide: !this.state.currentSlide
                  })}
                />
              </div>
            </div>
            {
              this.state.currentSlide ? (
                <>
                <Col className="default-setting-col" style={{paddingLeft: '130px', paddingRight: '130px'}}>
                  <div className="chart chart-xs">
                    {
                      !bar_status && (
                        <Bar data={this.state.barChart} options={options1} />
                      )
                    }
                  </div>
                </Col>
                </>
              ) : (
                <>
                <Col className="default-setting-col">
                  <p className="decks-title"><Translation>{(t, { i18n }) => <>{t('Decks')}</>}</Translation></p>
                  <div className="decks-group">
                    <p className="decks-value">{this.state.nDecksValue}</p>
                    <div className="decks-control-group">
                      <div>
                        <FontAwesomeIcon
                          className="align-middle decks"
                          icon={faCaretUp}
                          style={{color: '#fff', fontSize: '35px', cursor: 'pointer'}}
                          onClick={() => this.setState({
                            nDecksValue: this.state.nDecksValue + 1
                          })}
                        />
                      </div>
                      <div>
                        <FontAwesomeIcon
                          className="align-middle"
                          icon={faCaretDown}
                          style={{color: '#fff', fontSize: '35px', cursor: 'pointer'}}
                          onClick={() => this.setState({
                            nDecksValue: (this.state.nDecksValue - 1 < 0) ? 0 : this.state.nDecksValue - 1
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="default-setting-col">
                  <p className="running-count-title"><Translation>{(t, { i18n }) => <>{t('RunningCount')}</>}</Translation></p>
                  <p className="running-count-value">{this.nCardsSum > 0 ? '+' + this.nCardsSum : this.nCardsSum}</p>
                </Col>
                <Col className="default-setting-col">
                  <p className="decks-remaining-title"><Translation>{(t, { i18n }) => <>{t('DecksRemaining')}</>}</Translation></p>
                  <p className="decks-remaining-value">{this.state.nRemainingDecks}</p>
                </Col>
                <Col className="default-setting-col">
                  <p className="true-count-title"><Translation>{(t, { i18n }) => <>{t('TrueCount')}</>}</Translation></p>
                  <p className="true-count-value">{this.state.nTrueCount > 0 ? '+' + this.state.nTrueCount : this.state.nTrueCount}</p>
                </Col>
                </>
              )
            }
          </Row>
        </div>
        <Row className="m-0 players-group-pc">
          <div style={{width: '14.2%'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 1) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style1 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (1)</p>
          </div>
          <div style={{width: '14.2%', marginTop: '116px'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 2) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style1 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (2)</p>
          </div>
          <div style={{width: '14.2%', marginTop: '232px'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 3) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style1 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (3)</p>
          </div>
          <div style={{width: '14.2%'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 0) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style2 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name" style={{marginBottom: '200px'}}><Translation>{(t, { i18n }) => <>{t('House')}</>}</Translation></p>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 7) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style2 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (ME)</p>
          </div>
          <div style={{width: '14.2%', marginTop: '232px'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 4) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style3 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (4)</p>
          </div>
          <div style={{width: '14.2%', marginTop: '116px'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 5) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style3 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (5)</p>
          </div>
          <div style={{width: '14.2%'}}>
            {
              cards.map((rowData, index) => {
                if (rowData.area == 6) {
                  if (rowData.data.length) {
                    return (
                      <div key={index}>
                        {
                          rowData.data.map((dataArray, arrayIndex) => {
                            return (
                              <div className="group-relative" key={arrayIndex}>
                                <p className="player-value">{person_data[index][arrayIndex]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    dataArray.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="player-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="player-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index, arrayIndex)}>
                                            <span className="card-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="player-add-other-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, arrayIndex) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="card-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style3 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      dataArray.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index + '-' + arrayIndex} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, arrayIndex, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                    {
                                      (dataArray.length == 2 && dataArray[0] == dataArray[1]) && (
                                        <Button className="green_keyboard m-4 align-middle" onClick={()=>this.onCardSplit(index, arrayIndex)}><Translation>{(t, { i18n }) => <>{t('Split')}</>}</Translation></Button>
                                      )
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index, arrayIndex)}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div className="group-relative" key={index}>
                        <p className="player-value">0</p>
                        <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> game_row.length > 0 ? this.onDrop(e, index, 0) : this.setState({isGameRowModalOpen: true})}>
                          <div className="player-add-first-card" onClick={() => game_row.length > 0 ? this.onToggleIn(index, 0) : this.setState({isGameRowModalOpen: true})}>
                            <span className="card-value">+</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })
            }
            <p className="player-name"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation> (6)</p>
          </div>
          <div className={!this.state.isCardsDeckStatus ? 'cards_deck_body' : 'cards_deck_body_collapse'}>
            <div className="" style={{marginTop: '-32px', display: 'flex'}}>
              <Button className="reset-tab-btn" disabled={game_row.length > 0 ? false: true} onClick={()=>this.setState({isResetModalOpen: true})}><Translation>{(t, { i18n }) => <>{t('Reset')}</>}</Translation></Button>
              <Button className="new-tab-btn" disabled={game_row.length > 0 && this.isNextStep ? false: true} onClick={this.nextStep}><Translation>{(t, { i18n }) => <>{t('NewRound')}</>}</Translation></Button>
              <div className="cards_deck_collapse">
                <FontAwesomeIcon
                  className="double-downup"
                  icon={!this.state.isCardsDeckStatus ? faAngleDoubleDown : faAngleDoubleUp}
                  onClick={() => this.setState({
                    isCardsDeckStatus: !this.state.isCardsDeckStatus
                  })}
                />
              </div>
            </div>
            <div className="decks-group">
              <p className="decks-title-value"><Translation>{(t, { i18n }) => <>{t('Decks')}</>}</Translation> = {this.state.nDecksValue}</p>
              <div style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px'}}>
                <div style={{height: '15px'}}>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    style={{color: '#fff', fontSize: '15px', cursor: 'pointer'}}
                    onClick={() => this.setState({
                      nDecksValue: this.state.nDecksValue + 1
                    })}
                  />
                </div>
                <div style={{height: '15px'}}>
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    style={{color: '#fff', fontSize: '15px', cursor: 'pointer'}}
                    onClick={() => this.setState({
                      nDecksValue: (this.state.nDecksValue - 1 < 0) ? 0 : this.state.nDecksValue - 1
                    })}
                  />
                </div>
              </div>
            </div>
            <Row className="m-0">
              <div style={{margin: '0px 2.5px 7px 24px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 0, '2')}>
                  <span className="collapse-select-card-title">2</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 1, '3')}>
                  <span className="collapse-select-card-title">3</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 2, '4')}>
                  <span className="collapse-select-card-title">4</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 3, '5')}>
                  <span className="collapse-select-card-title">5</span>
                </div>
              </div>
              <div style={{margin: '0px 24px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 4, '6')}>
                  <span className="collapse-select-card-title">6</span>
                </div>
              </div>
            </Row>
            <Row className="m-0">
              <div style={{margin: '0px 2.5px 7px 24px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 5, '7')}>
                  <span className="collapse-select-card-title">7</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 6, '8')}>
                  <span className="collapse-select-card-title">8</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 7, '9')}>
                  <span className="collapse-select-card-title">9</span>
                </div>
              </div>
            </Row>
            <Row className="m-0">
              <div style={{margin: '0px 2.5px 7px 24px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 8, '10')}>
                  <span className="collapse-select-card-title">10</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 9, 'J')}>
                  <span className="collapse-select-card-title">J</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 10, 'Q')}>
                  <span className="collapse-select-card-title">Q</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 11, 'K')}>
                  <span className="collapse-select-card-title">K</span>
                </div>
              </div>
              <div style={{margin: '0px 24px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 12, 'A')}>
                  <span className="collapse-select-card-title">A</span>
                </div>
              </div>
            </Row>
          </div>
        </Row>
        <div>
          <Modal isOpen={this.state.isCardSelectModalOpen} toggle={this.onToggleOut} centered={true} size="sm">
            <ModalHeader toggle={this.onToggleOut}><span style={{fontSize: '24px', fontWeight: '700'}}>Select Card</span></ModalHeader>
            <ModalBody className="text-center m-auto">
              <p style={{color: '#000', textAlign: 'center', fontSize: '14px', fontWeight: '600', marginTop: '12px', marginBottom: '12px'}}>Decks = {this.state.nDecksValue}</p>
              <Row className="m-0">
                <div style={{margin: '0px 2.5px 7px 24px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(0, '2')}>
                    <span className="collapse-select-card-title">2</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(1, '3')}>
                    <span className="collapse-select-card-title">3</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(2, '4')}>
                    <span className="collapse-select-card-title">4</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(3, '5')}>
                    <span className="collapse-select-card-title">5</span>
                  </div>
                </div>
                <div style={{margin: '0px 24px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(4, '6')}>
                    <span className="collapse-select-card-title">6</span>
                  </div>
                </div>
              </Row>
              <Row className="m-0">
                <div style={{margin: '0px 2.5px 7px 24px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(5, '7')}>
                    <span className="collapse-select-card-title">7</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(6, '8')}>
                    <span className="collapse-select-card-title">8</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(7, '9')}>
                    <span className="collapse-select-card-title">9</span>
                  </div>
                </div>
              </Row>
              <Row className="m-0">
                <div style={{margin: '0px 2.5px 7px 24px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(8, '10')}>
                    <span className="collapse-select-card-title">10</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(9, 'J')}>
                    <span className="collapse-select-card-title">J</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(10, 'Q')}>
                    <span className="collapse-select-card-title">Q</span>
                  </div>
                </div>
                <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(11, 'K')}>
                    <span className="collapse-select-card-title">K</span>
                  </div>
                </div>
                <div style={{margin: '0px 24px 7px 2.5px'}}>
                  <div className="modal-select-card" onClick={() => this.onClickCard(12, 'A')}>
                    <span className="collapse-select-card-title">A</span>
                  </div>
                </div>
              </Row>
            </ModalBody>
          </Modal>
        </div>
        <div className={ "fetch-table" + (!sidebar.isOpen ? " toggled" : "") + (!sidebar.isSticky ? " sidebar-sticky" : "") }>
          <table className="hard-totals-table mb-1">
            <tbody>
            {
              hard_totals_table.map((rowData, index) => {
                return (
                  <tr key={index}>
                    {
                      rowData.map((cellData, cellIndex) => {
                        if (index == 0 && cellData == fetch_table[0] && this.hard_totals_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (cellIndex == 0 && cellData == fetch_table[1] && this.hard_totals_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (index == this.hard_totals_index && cellIndex == this.cell_index && this.hard_totals_flag) {
                          return (
                            <td style={{backgroundColor: 'rgba(254, 110, 0, 0.5)'}} key={cellIndex}>{cellData}</td>
                          )
                        } else {
                          return (
                            <td key={cellIndex}>{cellData}</td>
                          )
                        }
                      })
                    }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-1">S = STAND</p>
            </Col>
            <Col>
              <p className="mb-1">H = HIT</p>
            </Col>
          </Row>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-1 text-justify">D = DOUBLE IF ALLOWED, OTHERWISE HIT</p>
            </Col>
          </Row>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-1 text-justify">R/H = SURRENDER IF ALLOWED, OTHERWISE HIT</p>
            </Col>
          </Row>
          <table className="hard-totals-table mb-1">
            <tbody>
            {
              soft_totals_table.map((rowData, index) => {
                return (
                  <tr key={index}>
                    {
                      rowData.map((cellData, cellIndex) => {
                        if (index == 0 && cellData == fetch_table[0] && this.soft_totals_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (cellIndex == 0 && cellData == fetch_table[2] && this.soft_totals_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (index == this.soft_totals_index && cellIndex == this.cell_index && this.soft_totals_flag) {
                          return (
                            <td style={{backgroundColor: 'rgba(254, 110, 0, 0.5)'}} key={cellIndex}>{cellData}</td>
                          )
                        } else {
                          return (
                            <td key={cellIndex}>{cellData}</td>
                          )
                        }
                      })
                    }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-1 text-justify">Ds = DOUBLE IF ALLOWED, OTHERWISE STAND</p>
            </Col>
          </Row>
          <table className="hard-totals-table mb-1">
            <tbody>
            {
              pair_splitting_table.map((rowData, index) => {
                return (
                  <tr key={index}>
                    {
                      rowData.map((cellData, cellIndex) => {
                        if (index == 0 && cellData == fetch_table[0] && this.pair_splitting_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (cellIndex == 0 && cellData == fetch_table[2] && this.pair_splitting_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (index == this.pair_splitting_index && cellIndex == this.cell_index && this.pair_splitting_flag) {
                          return (
                            <td style={{backgroundColor: 'rgba(254, 110, 0, 0.5)'}} key={cellIndex}>{cellData}</td>
                          )
                        } else {
                          return (
                            <td key={cellIndex}>{cellData}</td>
                          )
                        }
                      })
                    }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-1">N = DON'T SPLIT THE PAIR</p>
              <p className="mb-1">Y = SPLIT THE PAIR</p>
              <p className="mb-1 text-justify">Y/N = SPLIT ONLY IF `DAS` IS OFFERED</p>
            </Col>
          </Row>
          <table className="hard-totals-table mb-1">
            <tbody>
            {
              surrender_table.map((rowData, index) => {
                return (
                  <tr key={index}>
                    {
                      rowData.map((cellData, cellIndex) => {
                        if (index == 0 && cellData == fetch_table[0] && this.surrender_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (cellIndex == 0 && cellData == fetch_table[1] && this.surrender_flag) {
                          return (
                            <td style={{borderWidth: '2px'}} key={cellIndex}>{cellData}</td>
                          )
                        } else if (index == this.surrender_index && cellIndex == this.cell_index && this.surrender_flag) {
                          return (
                            <td style={{backgroundColor: 'rgba(254, 110, 0, 0.5)'}} key={cellIndex}>{cellData}</td>
                          )
                        } else {
                          return (
                            <td key={cellIndex}>{cellData}</td>
                          )
                        }
                      })
                    }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
          <Row className="m-0">
            <Col className="pl-0">
              <p className="mb-0">SUR = SURRENDER</p>
            </Col>
          </Row>
        </div>
        <div>
          <Modal isOpen={this.state.isGameRowModalOpen} toggle={this.onToggleOut} centered={true} size="sm">
            <ModalHeader toggle={this.onToggleOut}><strong><Translation>{(t, { i18n }) => <>{t('Alert')}</>}</Translation></strong></ModalHeader>
            <ModalBody className="text-center">
              <div className="text-center">
                <h3 className="mb-3"><Translation>{(t, { i18n }) => <>{t('ClickNewGameComment')}</>}</Translation></h3>
                <Button className="green_keyboard" onClick={() => this.newPersonSession ? this.onNewGame() : this.setState({isNewModalOpen: true})}><Translation>{(t, { i18n }) => <>{t('NewGame')}</>}</Translation></Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
        <div>
          <Modal isOpen={this.state.isResetModalOpen} toggle={this.onToggleOut} centered={true} size="sm">
            <ModalHeader toggle={this.onToggleOut}><strong><Translation>{(t, { i18n }) => <>{t('Alert')}</>}</Translation></strong></ModalHeader>
            <ModalBody className="text-center">
              <div className="text-center">
                <h4><Translation>{(t, { i18n }) => <>{t('ResetClearEverythingComment')}</>}</Translation></h4>
                <h3 className="mb-0"><Translation>{(t, { i18n }) => <>{t('AreYouSureResetComment')}</>}</Translation></h3>
                <Button className="red_keyboard m-4" onClick={this.onToggleOut}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                <Button className="green_keyboard m-4" onClick={this.onResetState}><Translation>{(t, { i18n }) => <>{t('Reset')}</>}</Translation></Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
        <div>
          <Modal isOpen={this.state.isNewModalOpen} toggle={this.onToggleOut} centered={true} size="sm">
            <ModalHeader toggle={this.onToggleOut}><strong><Translation>{(t, { i18n }) => <>{t('Alert')}</>}</Translation></strong></ModalHeader>
            <ModalBody className="text-center">
              <div className="text-center">
                <h4 className="mb-3"><Translation>{(t, { i18n }) => <>{t('TermsConditions')}</>}</Translation><p><a href="https://bigdata666.net/pages/terms" target="blank" className="pricing-terms-condition"><Translation>{(t, { i18n }) => <>{t('UnderstandAcknowledgeComment')}</>}</Translation></a></p> <p><Translation>{(t, { i18n }) => <>{t('LetNewGame')}</>}</Translation></p></h4>
                <Button className="red_keyboard m-4" onClick={this.onToggleOut}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                <Button className="green_keyboard m-4" onClick={this.onNewGame}><Translation>{(t, { i18n }) => <>{t('NewGame')}</>}</Translation></Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
        <div>
          <Modal isOpen={this.state.isBlockBtnModalOpen} backdrop={'static'} centered={true} size="sm">
            <ModalBody className="text-center">
              <div>
                <h3 className="mt-3 mb-3"><b><Translation>{(t, { i18n }) => <>{t('Sorry')}</>}</Translation></b></h3>
                <h3 className="mb-3"><Translation>{(t, { i18n }) => <>{t('UpgradePlanComment')}</>}</Translation></h3>
                <Button className="red_keyboard m-4" href="/roulette"><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                <Button className="green_keyboard m-4" href="/pricing"><Translation>{(t, { i18n }) => <>{t('ComparePlan')}</>}</Translation></Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Container>
    )
  }
}

export default withRouter(
  connect(store => ({
    sidebar: store.sidebar
  }))(Default)
);