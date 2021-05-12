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
  XCircle,
  ArrowLeft,
  ArrowRight
} from "react-feather";
import { useTranslation, Translation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown, faAngleDoubleUp, faAngleDoubleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Bar, Pie } from "react-chartjs-2";
import Switch from "react-switch";
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
          max: 100,
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
        ticks: {
          fontColor: "#fff",
          fontSize: 15
        },
      }
    ]
  }
};

const options2 = {
  animation: false,
  maintainAspectRatio: false,
  tooltips: {
    display: false
  },
  legend: {
    display: false
  }
};

class Default extends Component
{
  nCards = 52;
  nCardsSum = 0;
  isNextStep = false;
  newPersonSession = false;
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: false,
      bar_status: false,
      currentSelectPersonID: null,
      isCardSelectModalOpen: false,
      isCardsDeckStatus: false,
      isGameRowModalOpen: false,
      isResetModalOpen: false,
      isNewModalOpen: false,
      isBlockBtnModalOpen: false,
      isRename: false,
      barChart: {
        labels: ["Banker", "Player", "Tie", "B-Pair", "P-Pair"],
        datasets: [
          {
            displays: ["Banker", "Player", "Tie", "B-Pair", "P-Pair"],
            backgroundColor: ["#E00600", "#1755FB", "#38C500", "#E00600", "#1755FB"],
            borderColor: ["#E00600", "#1755FB", "#38C500", "#E00600", "#1755FB"],
            hoverBackgroundColor: ["#E00600", "#1755FB", "#38C500", "#E00600", "#1755FB"],
            hoverBorderColor: ["#E00600", "#1755FB", "#38C500", "#E00600", "#1755FB"],
            data: [0, 0, 0, 0, 0]
          }
        ]
      },
      pieChart1: {
        labels: ["Player", "Banker", "Tie"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [
              "#1755FB", "#E00600", "#38C400"
            ],
            borderColor: "transparent"
          }
        ]
      },
      pieChart2: {
        labels: ["Player Pairs", "Banker Pairs", "Natural Hands"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [
              "#1755FB", "#E00600", "#ffd400"
            ],
            borderColor: "transparent"
          }
        ]
      },
      nDecksValue: 8,
      nStepCount: 0,
      nRemainingDecks: 0,
      nTrueCount: 0,
      nDividedBy: 0,
      person_data: [0, 0, 0],
      bacaGame_row: [],
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
        }
      ],
      tempResultGroup: [],
      resultGroup: [],
      show_notification: true,
      bar_message: '',
      enable_bar_click: false,
      on_click_go_to: '',
      open_in_a_new_tab: false,
      show_button: false,
      long_mode_flg: false,
      pattern_mode_flg: false,
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
    let bacaGame_row = window.localStorage.getItem('bacaGame_row');
    if (window.localStorage.getItem('new_game_status')) {
      this.newPersonSession = true;
    } else {
      this.newPersonSession = false;
    }
    let barChart = this.state.barChart;
    let pieChart1 = this.state.pieChart1;
    let pieChart2 = this.state.pieChart2;
    let cards = this.state.cards;
    let tempCards = [];
    let idx = 0;
    bacaGame_row = JSON.parse(bacaGame_row);
    if (bacaGame_row && bacaGame_row.length > 0) {
      for (var index = 0; index < bacaGame_row.length; index++) {
        if (bacaGame_row[index]['active'] == 1) {
          idx = index;
        }
      }
      barChart.datasets[0].data = bacaGame_row[idx]['barChart'];
      pieChart1.datasets[0].data = bacaGame_row[idx]['pieChart2'];
      pieChart2.datasets[0].data = bacaGame_row[idx]['pieChart2'];
      tempCards = bacaGame_row[idx]['cards'];
      if (tempCards.length > 0) {
        this.isNextStep = true;
        cards = cards.filter((card, index) => {
          card.data = tempCards[index];
          if (card.data.length < 2) {
            this.isNextStep = false;
          }
          return card;
        });
      }
      
      this.setState({
        bacaGame_row: bacaGame_row,
        barChart: barChart,
        pieChart1: pieChart1,
        pieChart2: pieChart2,
        person_data: bacaGame_row[idx]['person_data'],
        cards: cards,
        tempResultGroup: bacaGame_row[idx]['tempResultGroup'],
        resultGroup: bacaGame_row[idx]['resultGroup'],
        long_mode_flg: bacaGame_row[idx]['long_mode_flg'],
        pattern_mode_flg: bacaGame_row[idx]['pattern_mode_flg'],
        nDividedBy: bacaGame_row[idx]['nDividedBy'],
        nDecksValue: bacaGame_row[idx]['nDecksValue'],
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
          if (userinfo['subscription'] < 3) {
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

  onToggleIn = (area) => {
    this.setState({
      currentSelectPersonID: area,
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

  onSelectBanker = () => {
    this.setState({
      currentSelectPersonID: 0,
      type: ''
    })
  }

  onSelectPlayer = () => {
    this.setState({
      currentSelectPersonID: 1,
      type: ''
    })
  }

  onClickCard = (value, key) => {
    let personID = this.state.currentSelectPersonID;
    let bacaGame_row = this.state.bacaGame_row;
    let person_data = this.state.person_data;
    let cards = this.state.cards;
    let tempCards = [];

    this.isNextStep = true;
    cards = cards.filter((cardGroups) => {
      if (cardGroups.area == personID) {
        cardGroups.data.push(key);
      }
      if (cardGroups.data.length < 2) {
        this.isNextStep = false;
      }
      tempCards.push(cardGroups.data);
      return cardGroups;
    });
    
    person_data[personID] = parseInt(person_data[personID], 10) + value > 9 ? parseInt(person_data[personID], 10) + value - 10 : parseInt(person_data[personID], 10) + value;

    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['person_data'] = person_data;
        bacaGame_row[index]['cards'] = tempCards;
        bacaGame_row[index]['nDecksValue'] = this.state.nDecksValue;
      }
    }
    
    this.setState({
      bacaGame_row: bacaGame_row,
      cards: cards,
      person_data: person_data,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  onDragStart = (ev, value, key) => {
    ev.dataTransfer.setData("key", key);
    ev.dataTransfer.setData("value", value);
    if (this.state.bacaGame_row.length > 0) {
      ev.dataTransfer.setData("status", true);
    } else {
      ev.dataTransfer.setData("status", false);
    }
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onDrop = (ev, personID) => {
    let key = ev.dataTransfer.getData("key");
    let value = parseInt(ev.dataTransfer.getData("value"), 10);
    let status = ev.dataTransfer.getData("status");
    if (status) {
      // ev.dataTransfer.setData("status", false);
      let bacaGame_row = this.state.bacaGame_row;
      let cards = this.state.cards;
      let person_data = this.state.person_data;
      let tempCards = [];

      this.isNextStep = true;
      cards = cards.filter((cardGroups) => {
        if (cardGroups.area == personID) {
          cardGroups.data.push(key);
        }
        if (cardGroups.data.length < 2) {
          this.isNextStep = false;
        }
        tempCards.push(cardGroups.data);
        return cardGroups;
      });

      person_data[personID] = parseInt(person_data[personID], 10) + value > 9 ? parseInt(person_data[personID], 10) + value - 10 : parseInt(person_data[personID], 10) + value;

      for (var index = 0; index < bacaGame_row.length; index++) {
        if (bacaGame_row[index]['active'] == 1) {
          bacaGame_row[index]['person_data'] = person_data;
          bacaGame_row[index]['cards'] = tempCards;
          bacaGame_row[index]['nDecksValue'] = this.state.nDecksValue;
        }
      }
      
      this.setState({
        bacaGame_row: bacaGame_row,
        cards: cards,
        person_data: person_data,
        bar_status: true,
        type: ''
      })
      window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
    } else {
      console.log('error');
    }
  }

  nextStep = () => {
    this.onUndoHide();
    let bacaGame_row = this.state.bacaGame_row;
    let cards = this.state.cards;
    let barChart = this.state.barChart;
    let pieChart1 = this.state.pieChart1;
    let pieChart2 = this.state.pieChart2;
    let long_mode_flg = this.state.long_mode_flg;
    let pattern_mode_flg = this.state.pattern_mode_flg;
    let nDividedBy = this.state.nDividedBy;
    let tempResultGroup = this.state.tempResultGroup;
    let bankerResult = this.state.person_data[0];
    let playerResult = this.state.person_data[1];
    let bankerPair = false;
    let playerPair = false;
    let natural = false;
    cards = cards.filter((cardGroups, index) => {
      if (index == 0) {
        if (cardGroups.data[0] == cardGroups.data[1]) {
          bankerPair = true;
          barChart.datasets[0].data[3] += 1;
          pieChart2.datasets[0].data[1] += 1;
        }
        let sum = parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10) > 9 ? parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10) - 10 : parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10);
        if (sum > 7) {
          natural = true;
        }
      } else {
        if (cardGroups.data[0] == cardGroups.data[1]) {
          playerPair = true;
          barChart.datasets[0].data[4] += 1;
          pieChart2.datasets[0].data[0] += 1;
        }
        let sum = parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10) > 9 ? parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10) - 10 : parseInt(cardGroups.data[0], 10) + parseInt(cardGroups.data[1], 10);
        if (sum > 7) {
          natural = true;
        }
      }
      cardGroups.data = [];
      return cardGroups;
    });
    if (natural) {
      pieChart2.datasets[0].data[2] += 1;
    }

    let resultStack = {};
    if (bankerResult > playerResult) {
      resultStack['value'] = bankerResult;
      resultStack['win'] = 'banker';
      barChart.datasets[0].data[0] += 1;
      pieChart1.datasets[0].data[1] += 1;
    } else if (bankerResult < playerResult) {
      resultStack['value'] = playerResult;
      resultStack['win'] = 'player';
      barChart.datasets[0].data[1] += 1;
      pieChart1.datasets[0].data[0] += 1;
    } else {
      resultStack['value'] = playerResult;
      resultStack['win'] = 'tie';
      barChart.datasets[0].data[2] += 1;
      pieChart1.datasets[0].data[2] += 1;
    }
    resultStack['bankerPair'] = bankerPair;
    resultStack['playerPair'] = playerPair;
    tempResultGroup.push(resultStack);
    let resultGroup = [];
    if (long_mode_flg) {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            if (resultTempArray[resultTempArray.length - 1].win == result.win) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map((result, index) => {
          if (index != 0 && index % nDividedBy == 0) {
            resultGroup.push([]);
          }
          resultGroup.push([result]);
        });
      }
    } else {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      }
    }

    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['barChart'] = barChart.datasets[0].data;
        bacaGame_row[index]['pieChart1'] = pieChart1.datasets[0].data;
        bacaGame_row[index]['pieChart2'] = pieChart2.datasets[0].data;
        bacaGame_row[index]['person_data'] = [0, 0, 0];
        bacaGame_row[index]['cards'] = [];
        bacaGame_row[index]['tempResultGroup'] = tempResultGroup;
        bacaGame_row[index]['resultGroup'] = resultGroup;
      }
    }

    this.setState({
      currentSelectPersonID: 0,
      bacaGame_row: bacaGame_row,
      barChart: barChart,
      person_data: [0, 0, 0],
      cards: cards,
      tempResultGroup: tempResultGroup,
      resultGroup: resultGroup,
      bar_status: true,
      type: ''
    })
    this.nCardsSum = 0;
    this.isNextStep = false;

    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  onResetState = () => {
    this.onUndoHide();
    let cards = this.state.cards.filter((card) => {
      card.data = [];
      return card;
    });
    let barChart = this.state.barChart;
    let pieChart1 = this.state.pieChart1;
    let pieChart2 = this.state.pieChart2;
    barChart.datasets[0].data = [0, 0, 0, 0, 0];
    pieChart1.datasets[0].data = [0, 0, 0];
    pieChart2.datasets[0].data = [0, 0, 0];

    let bacaGame_row = this.state.bacaGame_row;

    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['person_data'] = [0, 0, 0];
        bacaGame_row[index]['barChart'] = [0, 0, 0, 0, 0];
        bacaGame_row[index]['pieChart1'] = [0, 0, 0];
        bacaGame_row[index]['pieChart2'] = [0, 0, 0];
        bacaGame_row[index]['nDecksValue'] = 8;
        bacaGame_row[index]['cards'] = [];
        bacaGame_row[index]['tempResultGroup'] = [];
        bacaGame_row[index]['resultGroup'] = [];
        bacaGame_row[index]['long_mode_flg'] = this.state.long_mode_flg;
        bacaGame_row[index]['pattern_mode_flg'] = this.state.pattern_mode_flg;
        bacaGame_row[index]['nDividedBy'] = this.state.nDividedBy;
      }
    }

    this.setState({
      bacaGame_row: bacaGame_row,
      barChart: barChart,
      pieChart1: pieChart1,
      pieChart2: pieChart2,
      person_data: [0, 0, 0],
      nDecksValue: 8,
      cards: cards,
      tempResultGroup: [],
      resultGroup: [],
      bar_status: true,
      isResetModalOpen: false,
      type: ''
    })
    this.nCardsSum = 0;
    this.isNextStep = false;

    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  none() {
    console.log('Please start new game first.');
  }

  onNewGame = () => {
    this.onUndoHide();
    window.localStorage.setItem('new_game_status', true);
    this.newPersonSession = true;
    var current_date = new Date();
    let bacaGame_row = this.state.bacaGame_row;
    let stack = {};
    stack['id'] = parseInt(current_date.getTime() / 1000);
    stack['active'] = 1;
    stack['name'] = 'G-' + parseInt(current_date.getTime() % 100000);
    stack['person_data'] = [0, 0, 0];
    stack['barChart'] = [0, 0, 0, 0, 0];
    stack['pieChart1'] = [0, 0, 0];
    stack['pieChart2'] = [0, 0, 0];
    stack['nDecksValue'] = 8;
    stack['cards'] = [];
    stack['tempResultGroup'] = [];
    stack['resultGroup'] = [];
    stack['long_mode_flg'] = this.state.long_mode_flg;
    stack['pattern_mode_flg'] = this.state.pattern_mode_flg;
    stack['nDividedBy'] = this.state.nDividedBy;
    if (bacaGame_row.length) {
      for (var index = 0; index < bacaGame_row.length; index++) {
        if (bacaGame_row[index]['active'] == 1) {
          bacaGame_row[index]['active'] = 0;
          bacaGame_row[index]['barChart'] = this.state.barChart.datasets[0].data;
          bacaGame_row[index]['pieChart1'] = this.state.pieChart1.datasets[0].data;
          bacaGame_row[index]['pieChart2'] = this.state.pieChart2.datasets[0].data;
          bacaGame_row[index]['person_data'] = this.state.person_data;
          bacaGame_row[index]['nDecksValue'] = this.state.nDecksValue;
          let cards = this.state.cards;
          let tempCards = [];
          cards = cards.filter((cardGroups) => {
            tempCards.push(cardGroups.data);
            return cardGroups;
          });
          bacaGame_row[index]['cards'] = tempCards;
          bacaGame_row[index]['tempResultGroup'] = this.state.tempResultGroup;
          bacaGame_row[index]['resultGroup'] = this.state.resultGroup;
          bacaGame_row[index]['long_mode_flg'] = this.state.long_mode_flg;
          bacaGame_row[index]['pattern_mode_flg'] = this.state.pattern_mode_flg;
          bacaGame_row[index]['nDividedBy'] = this.state.nDividedBy;
        }
      }
      bacaGame_row.splice(0, 0, stack);
    } else {
      bacaGame_row.push(stack);
    }
    this.setState({
      bacaGame_row: bacaGame_row,
      isGameRowModalOpen: false,
      isNewModalOpen: false,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
    this.onResetState(); 
  }

  onActiveGame = (idx) => {
    this.onUndoHide();
    let bacaGame_row = this.state.bacaGame_row;
    if (bacaGame_row.length) {
      let cards = this.state.cards;
      let barChart = this.state.barChart;
      let pieChart1 = this.state.pieChart1;
      let pieChart2 = this.state.pieChart2;
      let tempCards = [];
      for (var index = 0; index < bacaGame_row.length; index++) {
        if (bacaGame_row[index]['active'] == 1) {
          bacaGame_row[index]['active'] = 0;
          bacaGame_row[index]['barChart'] = barChart.datasets[0].data;
          bacaGame_row[index]['pieChart1'] = pieChart1.datasets[0].data;
          bacaGame_row[index]['pieChart2'] = pieChart2.datasets[0].data;
          bacaGame_row[index]['person_data'] = this.state.person_data;
          bacaGame_row[index]['nDecksValue'] = this.state.nDecksValue;
          cards = cards.filter((cardGroups) => {
            tempCards.push(cardGroups.data);
            return cardGroups;
          });
          bacaGame_row[index]['cards'] = tempCards;
          bacaGame_row[index]['tempResultGroup'] = this.state.tempResultGroup;
          bacaGame_row[index]['resultGroup'] = this.state.resultGroup;
          bacaGame_row[index]['long_mode_flg'] = this.state.long_mode_flg;
          bacaGame_row[index]['pattern_mode_flg'] = this.state.pattern_mode_flg;
          bacaGame_row[index]['nDividedBy'] = this.state.nDividedBy;
        }
      }
      bacaGame_row[idx]['active'] = 1;
      barChart.datasets[0].data = bacaGame_row[idx]['barChart'];
      pieChart1.datasets[0].data = bacaGame_row[idx]['pieChart1'];
      pieChart2.datasets[0].data = bacaGame_row[idx]['pieChart2'];
      this.isNextStep = true;
      tempCards = bacaGame_row[idx]['cards'];
      cards = cards.filter((card, index) => {
        card.data = tempCards[index];
        if (tempCards[index].length < 2) {
          this.isNextStep = false;
        }
        return card;
      });

      this.setState({
        bacaGame_row: bacaGame_row,
        barChart: barChart,
        pieChart1: pieChart1,
        pieChart2: pieChart2,
        person_data: bacaGame_row[idx]['person_data'],
        cards: cards,
        tempResultGroup: bacaGame_row[idx]['tempResultGroup'],
        resultGroup: bacaGame_row[idx]['resultGroup'],
        long_mode_flg: bacaGame_row[idx]['long_mode_flg'],
        pattern_mode_flg: bacaGame_row[idx]['pattern_mode_flg'],
        nDividedBy: bacaGame_row[idx]['nDividedBy'],
        nDecksValue: bacaGame_row[idx]['nDecksValue'],
        bar_status: true,
        type: ''
      })
    } else {
      this.setState({
        bacaGame_row: bacaGame_row,
        bar_status: true,
        type: ''
      })
    }
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  onCloseGame = (index) => {
    this.onUndoHide();
    let bacaGame_row = this.state.bacaGame_row;
    if (bacaGame_row[index]['active'] == 0) {
      bacaGame_row.splice(index, 1);
      this.setState({
        bacaGame_row: bacaGame_row,
        bar_status: true,
        type: ''
      })
      window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
    } else {
      bacaGame_row.splice(index, 1);
      if(bacaGame_row.length > 0) {
        let idx = bacaGame_row.length - 1;
        bacaGame_row[idx]['active'] = 1;
        let cards = this.state.cards;
        let barChart = this.state.barChart;
        let pieChart1 = this.state.pieChart1;
        let pieChart2 = this.state.pieChart2;
        let tempCards = [];
        barChart.datasets[0].data = bacaGame_row[idx]['barChart']
        pieChart1.datasets[0].data = bacaGame_row[idx]['pieChart1']
        pieChart2.datasets[0].data = bacaGame_row[idx]['pieChart2']

        this.isNextStep = true;
        tempCards = bacaGame_row[idx]['cards'];
        cards = cards.filter((card, index) => {
          card.data = tempCards[index];
          if (tempCards[index].length < 2) {
            this.isNextStep = true;
          }
          return card;
        });
        
        this.setState({
          bacaGame_row: bacaGame_row,
          barChart: barChart,
          pieChart1: pieChart1,
          pieChart2: pieChart2,
          person_data: bacaGame_row[idx]['person_data'],
          cards: cards,
          tempResultGroup: bacaGame_row[idx]['tempResultGroup'],
          resultGroup: bacaGame_row[idx]['resultGroup'],
          long_mode_flg: bacaGame_row[idx]['long_mode_flg'],
          pattern_mode_flg: bacaGame_row[idx]['pattern_mode_flg'],
          nDividedBy: bacaGame_row[idx]['nDividedBy'],
          nDecksValue: bacaGame_row[idx]['nDecksValue'],
          bar_status: true,
          type: ''
        })
        window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
      } else {
        this.setState({
          bacaGame_row: bacaGame_row,
          bar_status: true,
          type: ''
        })
        this.onResetState();
        window.localStorage.removeItem('bacaGame_row');
      }
    }
  }

  onChangeTitleStyle = (index) => {
    let bacaGame_row = this.state.bacaGame_row;
    this.setState({
      activeGameName: bacaGame_row[index]['name'],
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
    let bacaGame_row = this.state.bacaGame_row;
    if (bacaGame_row) {
      for (var index = 0; index < bacaGame_row.length; index++) {
        if (bacaGame_row[index]['active'] === 1) {
          bacaGame_row[index]['name'] = this.state.activeGameName;
        }
      }
      this.setState({
        bacaGame_row: bacaGame_row
      })
      window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
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

  onUndoHideShow = (area) => {
    if ($('.undo-group-' + area).closest('.undo-group').hasClass('undo-group-hidden')) {
      $('.undo-group-' + area).closest('.undo-group').removeClass('undo-group-hidden');
      $('.undo-group-' + area).closest('.undo-group').addClass('undo-group-show');
    } else {
      $('.undo-group-' + area).closest('.undo-group').addClass('undo-group-hidden');
      $('.undo-group-' + area).closest('.undo-group').removeClass('undo-group-show');
    }
  }

  onRemoveCard = (area, cardIdx) => {
    let personID = area;
    let key = '';
    let value = 0;
    let bacaGame_row = this.state.bacaGame_row;
    let barChart = this.state.barChart;
    let person_data = this.state.person_data;
    let cards = this.state.cards;
    let tempCards = [];
    let tempCard = [];

    this.isNextStep = true;
    cards = cards.filter((cardGroups) => {
      if (cardGroups.area == personID) {
        key = cardGroups.data[cardIdx];
        cardGroups.data.splice(cardIdx, 1);
        tempCard = [...cardGroups.data];
      }
      if (cardGroups.data.length < 2) {
        this.isNextStep = false;
      }
      tempCards.push(cardGroups.data);
      return cardGroups;
    });

    if (!Number(parseInt(key, 10))) {
      if (key == 'A') {
        value = 1;
      } else {
        value = 0;
      }
    } else {
      value = parseInt(key, 10) == 10 ? 0 : parseInt(key, 10);
    }

    person_data[personID] = parseInt(person_data[personID], 10) - value < 0 ? parseInt(person_data[personID], 10) - value + 10 : parseInt(person_data[personID], 10) - value;

    if (!tempCard.length) {
      this.onUndoHideShow(personID);
    }

    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['barChart'] = barChart.datasets[0].data;
        bacaGame_row[index]['person_data'] = person_data;
        bacaGame_row[index]['cards'] = tempCards;
      }
    }
    
    this.setState({
      bacaGame_row: bacaGame_row,
      cards: cards,
      barChart: barChart,
      person_data: person_data,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
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

  longModeChange = (checked) => {
    let tempResultGroup = this.state.tempResultGroup;
    let pattern_mode_flg = this.state.pattern_mode_flg;
    let nDividedBy = this.state.nDividedBy;
    let resultGroup = [];
    if (checked) {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            if (resultTempArray[resultTempArray.length - 1].win == result.win) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map((result, index) => {
          if (index != 0 && index % nDividedBy == 0) {
            resultGroup.push([]);
          }
          resultGroup.push([result]);
        });
      }
    } else {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      }
    }
    let bacaGame_row = this.state.bacaGame_row;
    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['resultGroup'] = resultGroup;
        bacaGame_row[index]['long_mode_flg'] = checked;
      }
    }
    this.setState({
      long_mode_flg: checked,
      resultGroup: resultGroup,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  patternModeChange = (checked) => {
    let tempResultGroup = this.state.tempResultGroup;
    let long_mode_flg = this.state.long_mode_flg;
    let nDividedBy = this.state.nDividedBy;
    let resultGroup = [];
    if (long_mode_flg) {
      if (checked) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            if (resultTempArray[resultTempArray.length - 1].win == result.win) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map((result, index) => {
          if (index != 0 && index % nDividedBy == 0) {
            resultGroup.push([]);
          }
          resultGroup.push([result]);
        });
      }
    } else {
      if (checked) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      }
    }
    let bacaGame_row = this.state.bacaGame_row;
    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['resultGroup'] = resultGroup;
        bacaGame_row[index]['pattern_mode_flg'] = checked;
      }
    }
    this.setState({
      pattern_mode_flg: checked,
      resultGroup: resultGroup,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  addDividedBy = () => {
    let nDividedBy = this.state.nDividedBy + 1;
    let tempResultGroup = this.state.tempResultGroup;
    let long_mode_flg = this.state.long_mode_flg;
    let pattern_mode_flg = this.state.pattern_mode_flg;
    let resultGroup = [];
    if (long_mode_flg) {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            if (resultTempArray[resultTempArray.length - 1].win == result.win) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map((result, index) => {
          if (index != 0 && index % nDividedBy == 0) {
            resultGroup.push([]);
          }
          resultGroup.push([result]);
        });
      }
    } else {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      }
    }
    let bacaGame_row = this.state.bacaGame_row;
    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['resultGroup'] = resultGroup;
        bacaGame_row[index]['nDividedBy'] = nDividedBy;
      }
    }
    this.setState({
      nDividedBy: nDividedBy,
      resultGroup: resultGroup,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
  }

  delDividedBy = () => {
    let nDividedBy = this.state.nDividedBy == 0 ? 0 : this.state.nDividedBy - 1;
    let tempResultGroup = this.state.tempResultGroup;
    let long_mode_flg = this.state.long_mode_flg;
    let pattern_mode_flg = this.state.pattern_mode_flg;
    let resultGroup = [];
    if (long_mode_flg) {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            if (resultTempArray[resultTempArray.length - 1].win == result.win) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map((result, index) => {
          if (index != 0 && index % nDividedBy == 0) {
            resultGroup.push([]);
          }
          resultGroup.push([result]);
        });
      }
    } else {
      if (pattern_mode_flg) {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      } else {
        tempResultGroup.map(result => {
          if (resultGroup.length) {
            let resultTempArray = resultGroup[resultGroup.length - 1];
            nDividedBy = nDividedBy > 0 ? nDividedBy : 6;
            if (resultTempArray.length < nDividedBy) {
              resultGroup[resultGroup.length - 1].push(result);
            } else {
              resultGroup.push([result]);
            }
          } else {
            resultGroup.push([result]);
          }
        });
      }
    }
    let bacaGame_row = this.state.bacaGame_row;
    for (var index = 0; index < bacaGame_row.length; index++) {
      if (bacaGame_row[index]['active'] == 1) {
        bacaGame_row[index]['resultGroup'] = resultGroup;
        bacaGame_row[index]['nDividedBy'] = nDividedBy;
      }
    }
    this.setState({
      nDividedBy: nDividedBy,
      resultGroup: resultGroup,
      bar_status: true,
      type: ''
    })
    window.localStorage.setItem('bacaGame_row', JSON.stringify(bacaGame_row));
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
    let { bar_status, person_data, bacaGame_row, isRename, cards, resultGroup, nDividedBy, notification_style, message_style, bar_message, show_discount_code, discount_btn_style, discount_code, show_button, button_style, button_text, close_style, show_notification, enable_bar_click, barChart, pieChart1, pieChart2, currentSelectPersonID } = this.state;
    let playerPie = parseInt(pieChart1.datasets[0].data[0], 10);
    let bankerPie = parseInt(pieChart1.datasets[0].data[1], 10);
    let tiePie = parseInt(pieChart1.datasets[0].data[2], 10);
    let playerPiePercent = (playerPie + bankerPie + tiePie) == 0 ? 0 : Math.ceil((playerPie / (playerPie + bankerPie + tiePie) * 100) * 100) / 100;
    let bankerPiePercent = (playerPie + bankerPie + tiePie) == 0 ? 0 : Math.ceil((bankerPie / (playerPie + bankerPie + tiePie) * 100) * 100) / 100;
    let tiePiePercent = (playerPie + bankerPie + tiePie) == 0 ? 0 : Math.ceil((tiePie / (playerPie + bankerPie + tiePie) * 100) * 100) / 100;
    let playerPairPie = parseInt(pieChart2.datasets[0].data[0], 10);
    let bankerPairPie = parseInt(pieChart2.datasets[0].data[1], 10);
    let naturalPie = parseInt(pieChart2.datasets[0].data[2], 10);
    let playerPairPiePercent = (playerPairPie + bankerPairPie + naturalPie) == 0 ? 0 : Math.ceil((playerPairPie / (playerPairPie + bankerPairPie + naturalPie) * 100) * 100) / 100;
    let bankerPairPiePercent = (playerPairPie + bankerPairPie + naturalPie) == 0 ? 0 : Math.ceil((bankerPairPie / (playerPairPie + bankerPairPie + naturalPie) * 100) * 100) / 100;
    let naturalPiePercent = (playerPairPie + bankerPairPie + naturalPie) == 0 ? 0 : Math.ceil((naturalPie / (playerPairPie + bankerPairPie + naturalPie) * 100) * 100) / 100;
    return(
      <Container fluid className="p-0" style={{backgroundColor: '#2D1C1C', minHeight: '100vh'}}>
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
        <Row className="m-0 pt-1" style={{backgroundColor: '#2D1C1C'}}>
          <Col>
            <div className="game_slider">
              <div className="game_group">
                {
                  bacaGame_row.map((row, index) => {
                    if (index === bacaGame_row.length - 1) {
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
                  bacaGame_row.length > 0 ? (
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
        <div className="header-section">
          <Row className="m-0 p-3 analysis-section">
            <div>
              <div className="d-flex">
              {
                resultGroup.map((resultArray, resultArrayIndex) => {
                  if (resultArray.length) {
                    return (
                      <div key={resultArrayIndex}>
                        {
                          resultArray.map((result, resultIndex) => {
                            return (
                              <div key={resultIndex} className={result.win == 'tie' ? 'tieResult' : result.win == 'player' ? 'playerResult' : 'bankerResult'}>
                                {
                                  result.bankerPair && (
                                    <div className="bankerPair"></div>
                                  )
                                }
                                <span className="valueResult">{result.value}</span>
                                {
                                  result.playerPair && (
                                    <div className="playerPair"></div>
                                  )
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  } else {
                    return (
                      <div key={resultArrayIndex}><div className="spaceResult"></div></div>
                    )
                  }
                })
              }
              </div>
            </div>
          </Row>
          <Row className="m-0 p-3 setting-section">
            <Col>
              <div className="d-flex">
                <div className="ml-auto" style={{marginRight: '17px'}}>
                  <Switch
                    uncheckedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 18,
                          color: "#685879",
                          paddingRight: 5
                        }}
                      >
                        OFF
                      </div>
                    }
                    checkedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 18,
                          color: "#fff",
                          paddingLeft: 5
                        }}
                      >
                        ON
                      </div>
                    }
                    checked={this.state.long_mode_flg}
                    onChange={this.longModeChange}
                    className="react-switch"
                    id="long_mode"
                    handleDiameter={25}
                    height={30}
                    width={75}
                    offColor="#fff"
                    onColor="#1755FB"
                    offHandleColor="#685879"
                    onHandleColor="#fff"
                  />
                  <p style={{color: '#fff', fontSize: 18}}><Translation>{(t, { i18n }) => <>{t('LongMode')}</>}</Translation></p>
                </div>
              </div>
              <div className="d-flex mt-2">
                <div className="ml-auto">
                  <Switch
                    uncheckedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 18,
                          color: "#685879",
                          paddingRight: 5
                        }}
                      >
                        OFF
                      </div>
                    }
                    checkedIcon={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          fontSize: 18,
                          color: "#fff",
                          paddingLeft: 5
                        }}
                      >
                        ON
                      </div>
                    }
                    checked={this.state.pattern_mode_flg}
                    onChange={this.patternModeChange}
                    className="react-switch"
                    id="pattern_mode"
                    handleDiameter={25}
                    height={30}
                    width={75}
                    offColor="#fff"
                    onColor="#1755FB"
                    offHandleColor="#685879"
                    onHandleColor="#fff"
                  />
                  <p style={{color: '#fff', fontSize: 18}}><Translation>{(t, { i18n }) => <>{t('PatternMode')}</>}</Translation></p>
                </div>
              </div>
              <div className="d-flex mt-3">
                <div className="ml-auto">
                  <div style={{display: 'flex'}}>
                    <span style={{alignSelf: 'center', color: '#fff', fontSize: 18}}><Translation>{(t, { i18n }) => <>{t('DividedBy')}</>}</Translation>___{nDividedBy}__</span>
                    <div className="">
                      <div>
                        <FontAwesomeIcon
                          className="align-middle change-slide-caret-up"
                          icon={faCaretUp}
                          onClick={this.addDividedBy}
                        />
                      </div>
                      <div>
                        <FontAwesomeIcon
                          className="align-middle change-slide-caret-down"
                          icon={faCaretDown}
                          onClick={this.delDividedBy}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="d-flex mt-3">
                <div style={{width: '50%', borderColor: '#FFD479', borderWidth: '1px', borderStyle: 'solid'}} >
                  {
                    cards.map((rowData, index) => {
                      if (rowData.area == 0) {
                        if (rowData.data.length) {
                          return (
                            <div key={index}>
                              <div className="group-relative">
                                <p className="player-value">{person_data[index]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> bacaGame_row.length > 0 ? this.onDrop(e, index) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    rowData.data.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="bacaBanker-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index)}>
                                            <span className="bacaCard-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="bacaBanker-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index)}>
                                            <span className="bacaCard-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="bacaBanker-add-other-card" onClick={() => bacaGame_row.length > 0 ? this.onToggleIn(index) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="bacaCard-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style3 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      rowData.data.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index)}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div className="group-relative" key={index}>
                              <p className="player-value">0</p>
                              <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> bacaGame_row.length > 0 ? this.onDrop(e, index) : this.setState({isGameRowModalOpen: true})}>
                                <div className="bacaBanker-add-first-card" onClick={() => bacaGame_row.length > 0 ? this.onToggleIn(index) : this.setState({isGameRowModalOpen: true})}>
                                  <span className="bacaCard-value">+</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      }
                    })
                  }
                  <p className="player-name mb-0"><Translation>{(t, { i18n }) => <>{t('Banker')}</>}</Translation></p>
                </div>
                <div style={{width: '50%', borderColor: '#FFD479', borderWidth: '1px', borderStyle: 'solid'}}>
                  {
                    cards.map((rowData, index) => {
                      if (rowData.area == 1) {
                        if (rowData.data.length) {
                          return (
                            <div key={index}>
                              <div className="group-relative">
                                <p className="player-value">{person_data[index]}</p>
                                <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> bacaGame_row.length > 0 ? this.onDrop(e, index) : this.setState({isGameRowModalOpen: true})}>
                                  {
                                    rowData.data.map((cellData, cellIndex) => {
                                      if (cellIndex == 0) {
                                        return (
                                          <div className="bacaPlayer-selected-first-card" key={cellIndex} onClick={() => this.onUndoHideShow(index)}>
                                            <span className="bacaCard-value">{cellData}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div className="bacaPlayer-selected-other-card" key={cellIndex} onClick={() => this.onUndoHideShow(index)}>
                                            <span className="bacaCard-value">{cellData}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                  <div className="bacaPlayer-add-other-card" onClick={() => bacaGame_row.length > 0 ? this.onToggleIn(index) : this.setState({isGameRowModalOpen: true})}>
                                    <span className="bacaCard-value">+</span>
                                  </div>
                                </div>
                                <div className="undo-group undo-style3 undo-group-hidden">
                                  <div className="undo-group-body">
                                    {
                                      rowData.data.map((cellData, cellIndex) => {
                                        return (
                                          <div className={'undo-card undo-group-' + index} key={cellIndex}>
                                            <FontAwesomeIcon
                                              className="align-middle remove-card"
                                              icon={faTimesCircle}
                                              style={{position: 'absolute', top: '-5px', right: '-5px', color: '', fontSize: '20px', cursor: 'pointer'}}
                                              onClick={()=>this.onRemoveCard(index, cellIndex)}
                                            />
                                            <span className="collapse-select-card-title">{cellData}</span>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                  <FontAwesomeIcon
                                    className="align-middle remove-card"
                                    icon={faTimesCircle}
                                    style={{position: 'absolute', top: '-15px', right: '-15px', color: '', fontSize: '20px', cursor: 'pointer', color: '#fff'}}
                                    onClick={() => this.onUndoHideShow(index)}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div className="group-relative" key={index}>
                              <p className="player-value">0</p>
                              <div className="player-cards-area" onDragOver={(e)=>this.onDragOver(e)} onDrop={(e)=> bacaGame_row.length > 0 ? this.onDrop(e, index) : this.setState({isGameRowModalOpen: true})}>
                                <div className="bacaPlayer-add-first-card" onClick={() => bacaGame_row.length > 0 ? this.onToggleIn(index) : this.setState({isGameRowModalOpen: true})}>
                                  <span className="bacaCard-value">+</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      }
                    })
                  }
                  <p className="player-name mb-0"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation></p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Row className="m-0 bacarat-players-group">
          <div className="chart-section mt-3 p-2">
            <Row>
              <Col lg="4">
                <div className="chart chart-xs" style={{width: '300px'}}>
                {
                  !bar_status && (
                    <Bar data={barChart} options={options1} />
                  )
                }
                </div>
              </Col>
              <Col lg="8">
                <table style={{width: '100%', backgroundColor: '#fff'}}>
                  <tbody>
                    <tr style={{border: '1px solid #DDD'}}>
                      <th rowSpan="3" style={{border: '1px solid #DDD'}}>
                        <div className="chart chart-xs" style={{width: '80px', height: '80px'}}>
                          {
                            !bar_status && (
                              <Pie data={pieChart1} options={options2} />
                            )
                          }
                        </div>
                      </th>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'playerDec'}>
                          <span className="valueDec">P</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{playerPie}</td>
                      <td style={{border: '1px solid #DDD'}}>{playerPiePercent}%</td>
                      <th rowSpan="3" style={{border: '1px solid #DDD'}}>
                        <div className="chart chart-xs" style={{width: '80px', height: '80px'}}>
                          {
                            !bar_status && (
                              <Pie data={pieChart2} options={options2} />
                            )
                          }
                        </div>
                      </th>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'playerDec'}>
                          <span className="valueDec">P</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('PlayerPair')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{playerPairPie}</td>
                      <td style={{border: '1px solid #DDD'}}>{playerPairPiePercent}%</td>
                    </tr>
                    <tr style={{border: '1px solid #DDD'}}>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'bankerDec'}>
                          <span className="valueDec">B</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('Banker')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{bankerPie}</td>
                      <td style={{border: '1px solid #DDD'}}>{bankerPiePercent}%</td>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'bankerDec'}>
                          <span className="valueDec">B</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('BankerPair')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{bankerPairPie}</td>
                      <td style={{border: '1px solid #DDD'}}>{bankerPairPiePercent}%</td>
                    </tr>
                    <tr style={{border: '1px solid #DDD'}}>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'tieDec'}>
                          <span className="valueDec">T</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('Tie')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{tiePie}</td>
                      <td style={{border: '1px solid #DDD'}}>{tiePiePercent}%</td>
                      <td style={{ display: 'flex', alignItems: 'center'}}>
                        <div className={'naturalDec'}>
                          <span className="valueDec">N</span>
                        </div>
                        <Translation>{(t, { i18n }) => <>{t('NaturalHands')}</>}</Translation>
                      </td>
                      <td style={{border: '1px solid #DDD', padding: 5}}>{naturalPie}</td>
                      <td style={{border: '1px solid #DDD'}}>{naturalPiePercent}%</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
          <div className={!this.state.isCardsDeckStatus ? 'cards_deck_body' : 'cards_deck_body_collapse'}>
            <div className="" style={{marginTop: '-32px', display: 'flex'}}>
              <Button className="reset-tab-btn" disabled={bacaGame_row.length > 0 ? false: true} onClick={()=>this.setState({isResetModalOpen: true})}><Translation>{(t, { i18n }) => <>{t('Reset')}</>}</Translation></Button>
              <Button className="log-round-btn" disabled={bacaGame_row.length > 0 && this.isNextStep ? false: true} onClick={this.nextStep}><Translation>{(t, { i18n }) => <>{t('LogRound')}</>}</Translation></Button>
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
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 1, 'A')}>
                  <span className="collapse-select-card-title">A</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 2, '2')}>
                  <span className="collapse-select-card-title">2</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 3, '3')}>
                  <span className="collapse-select-card-title">3</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 4, '4')}>
                  <span className="collapse-select-card-title">4</span>
                </div>
              </div>
            </Row>
            <Row className="m-0">
              <div style={{margin: '0px 2.5px 7px 24px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 5, '5')}>
                  <span className="collapse-select-card-title">5</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 6, '6')}>
                  <span className="collapse-select-card-title">6</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 7, '7')}>
                  <span className="collapse-select-card-title">7</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 8, '8')}>
                  <span className="collapse-select-card-title">8</span>
                </div>
              </div>
            </Row>
            <Row className="m-0">
              <div style={{margin: '0px 2.5px 7px 24px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 9, '9')}>
                  <span className="collapse-select-card-title">9</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 0, '10')}>
                  <span className="collapse-select-card-title">10</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 0, 'J')}>
                  <span className="collapse-select-card-title">J</span>
                </div>
              </div>
              <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 0, 'Q')}>
                  <span className="collapse-select-card-title">Q</span>
                </div>
              </div>
              <div style={{margin: '0px 24px 7px 2.5px'}}>
                <div className="collapse-select-card" onDragOver={(e)=>this.onDragOver(e)} draggable={true} onDragStart = {(e) => this.onDragStart(e, 0, 'K')}>
                  <span className="collapse-select-card-title">K</span>
                </div>
              </div>
            </Row>
          </div>
        </Row>
        <div>
          <Modal isOpen={this.state.isCardSelectModalOpen} toggle={this.onToggleOut} centered={true} style={{width: '450px'}} >
            <ModalHeader toggle={this.onToggleOut}><span style={{fontSize: '24px', fontWeight: '700'}}>Select Card</span></ModalHeader>
            <ModalBody className="text-center">
              <Row className="mr-0 ml-0 mb-3">
                <Col onClick={this.onSelectBanker}>
                  <p className="align-middle mb-1 cursor-pointer banker-title"><ArrowLeft size={20} className="align-middle cursor-pointer mr-2 back-next-arrow"/><Translation>{(t, { i18n }) => <>{t('Banker')}</>}</Translation></p>
                  <hr className={currentSelectPersonID == 0 ? 'active-hr' : 'inactive-hr'} />
                </Col>
                <Col className="mr-auto ml-auto">
                  <Button className={bacaGame_row.length > 0 && this.isNextStep ? 'log-round-btn': 'log-disable-round-btn'} disabled={bacaGame_row.length > 0 && this.isNextStep ? false: true} onClick={this.nextStep} style={{borderRadius: '10px'}}><Translation>{(t, { i18n }) => <>{t('LogRound')}</>}</Translation></Button>
                </Col>
                <Col onClick={this.onSelectPlayer}>
                  <p className="align-middle mb-1 cursor-pointer player-title"><Translation>{(t, { i18n }) => <>{t('Player')}</>}</Translation><ArrowRight size={20} className="align-middle cursor-pointer ml-2 back-next-arrow"/></p>
                  <hr className={currentSelectPersonID == 1 ? 'active-hr' : 'inactive-hr'} />
                </Col>
              </Row>
              <div className="pl-5">
                <Row className="m-0">
                  <div style={{margin: '0px 2.5px 7px 24px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(1, 'A')}>
                      <span className="collapse-select-card-title">A</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(2, '2')}>
                      <span className="collapse-select-card-title">2</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(3, '3')}>
                      <span className="collapse-select-card-title">3</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(4, '4')}>
                      <span className="collapse-select-card-title">4</span>
                    </div>
                  </div>
                </Row>
                <Row className="m-0">
                  <div style={{margin: '0px 2.5px 7px 24px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(5, '5')}>
                      <span className="collapse-select-card-title">5</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(6, '6')}>
                      <span className="collapse-select-card-title">6</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(7, '7')}>
                      <span className="collapse-select-card-title">7</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(8, '8')}>
                      <span className="collapse-select-card-title">8</span>
                    </div>
                  </div>
                </Row>
                <Row className="m-0">
                  <div style={{margin: '0px 2.5px 7px 24px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(9, '9')}>
                      <span className="collapse-select-card-title">9</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(0, '10')}>
                      <span className="collapse-select-card-title">10</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(0, 'J')}>
                      <span className="collapse-select-card-title">J</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 2.5px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(0, 'Q')}>
                      <span className="collapse-select-card-title">Q</span>
                    </div>
                  </div>
                  <div style={{margin: '0px 24px 7px 2.5px'}}>
                    <div className="modal-select-card" onClick={() => this.onClickCard(0, 'K')}>
                      <span className="collapse-select-card-title">K</span>
                    </div>
                  </div>
                </Row>
              </div>
            </ModalBody>
          </Modal>
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