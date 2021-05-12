import React from "react";
import { Link } from 'react-router-dom';
import { toastr } from "react-redux-toastr";
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CustomInput, 
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDownload } from "@fortawesome/free-solid-svg-icons";
import professional from "../../assets/img/Professional.png";
import extreme from "../../assets/img/extreme.png";
import extreme_robot from "../../assets/img/Robot.png";
import partnership from "../../assets/img/Partnership.png";
import TextField from '@material-ui/core/TextField';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useTranslation, Translation } from 'react-i18next';
import { BallBeat } from 'react-pure-loaders';
import * as UserService from '../../action/user';
import * as PaymentService from '../../action/payment';
import config from '../../config';

const APIUrl = config.server.APIUrl;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useStylesReddit = makeStyles(theme => ({
  root: {
    border: '1px solid #979797',
    overflow: 'hidden',
    borderRadius: 7.2,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
    },
    '&$focused': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: '#229ea9',
    },
  },
  eye: {
    cursor: 'pointer',
  },
  focused: {},
}));

function RedditTextField(props) {
  const classes = useStylesReddit();

  return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
}

class Pricing extends React.Component {
  flgSubscribe = false;
  update_status = false;
  constructor(props) {
    super(props);
    this.state = {
      title: "Pay Result",
      message: "Hello!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      isSubscription: false,
      isExpired: false,
      isSuperuser: 0,
      expired_datetime: '',
      isApple: '',
      subscriptionLevel: 0,
      planID: 0,
      isExtraDate: false,
      uSubscribe: '',
      extraDateText: '',
      isCancelModalOpen: false,
      isUpDownModalOpen: false,
      isUpDownRobotModalOpen: false,
      isSuperUserModalOpen: false,
      isCheckedTAP: false,
      youtube_account_url: '',
      twitch_account_url: '',
      vimeo_account_url: '',
      discord_account_url: '',
      loading: false,
      pro_price: 0,
      extreme_price: 0,
      robot_price: 0
    };
  }

  async componentDidMount() {

    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    let self = this;
    let user_id = userinfo['id'];
    UserService.get_profile(user_id).then(async(res)=> {
      if (res.data.success) {
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
        userinfo = res.data.userinfo;
        self.setState({
          isSuperuser: res.data.userinfo['super_user']
        })
        if (res.data.userinfo['subscription'] === 0) {
          self.setState({
            subscriptionLevel: 0
          })
        } else {
          if (userinfo['billingAgreementId']) {
            PaymentService.get_state({user_id: user_id, billingAgreementId: userinfo['billingAgreementId']}).then(async(res)=> {
              if (res.data.success) {
                let send_data = {};
                var expired_at = new Date(res.data.result.agreement_details.next_billing_date);
                let updated_at = new Date(res.data.result.agreement_details.next_billing_date);
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
                if (diffTime > 0) {
                  updated_at = months[updated_at.getMonth()] + ' '  + updated_at.getDate() + ', ' + updated_at.getFullYear();
                }
                expired_at = new Date(expired_at).getFullYear() + '-'  + (new Date(expired_at).getMonth() + 1) + '-' + new Date(expired_at).getDate() + ' '  + new Date(expired_at).getHours() + ':' + new Date(expired_at).getMinutes() + ':' + new Date(expired_at).getSeconds();
                if (res.data.result.state === 'Active') {
                  send_data['id'] = user_id;
                  send_data['expired_at'] = expired_at;
                  this.flgSubscribe = true;
        
                  UserService.update_profile(send_data).then(function(res) {
                    if (res.data.success) {
                      self.setState({
                        subscriptionLevel: res.data.userinfo['subscription']
                      });
                      window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
                    } else {
                      console.log('fail');
                    }
                  })
                } else {
                  self.setState({
                    subscriptionLevel: 0,
                    expired_datetime: diffTime > 0 ? updated_at : '',
                    isApple: diffTime > 0 ? 'PaypalPay' : ''
                  })
                  send_data['id'] = user_id;
                  send_data['expired_at'] = expired_at;
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
          } else {
            var expired_at = new Date(userinfo.expired_at);
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
            if (diffTime > 0) {
              expired_at = months[expired_at.getMonth()] + ' '  + expired_at.getDate() + ', ' + expired_at.getFullYear();
            }
            
            self.setState({
              subscriptionLevel: userinfo['subscription'],
              expired_datetime: diffTime > 0 ? expired_at : '',
              isApple: diffTime > 0 ? 'ApplePay' : ''
            })
          }
          
        }
      } else {
        console.log('fail');
      }
    })

    const plans = await UserService.get_plans();
    this.setState({
      pro_price: plans.data.plans[0]['price'],
      extreme_price: plans.data.plans[1]['price'],
      robot_price:  plans.data.plans[2]['price']
    })
  }

  componentDidUpdate() {
    if (this.state.type === 'error') {
      this.showToastr();
    }
    if (this.update_status) {
      this.update_status = false;
    }
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
  
  onCancel = () => {
    let self = this;
    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    if (userinfo['billingAgreementId']) {
      PaymentService.cancel({user_id: userinfo.id, billingAgreementId: userinfo['billingAgreementId']}).then(async(res)=> {
        if (res.data.success) {
          this.flgSubscribe = false;
          self.setState({
            title: "Pay Result",
            type: "success",
            message: "Successful Canceled your Plan!",
            subscriptionLevel: 0,
            isCancelModalOpen: false
          });
          self.showToastr();
        } else {
          console.log('fail');
          self.setState({
            title: "Pay Result",
            isCancelModalOpen: false,
            type: "error",
            message: "Erroneous payment OR failed to load script! Try again."
          })
        }
      })
    }
  }

  onSelectPlan = (planID) => {
    this.setState({
      planID: planID
    })
    let self = this;
    if (planID === 3) {
      self.toggle_in3();
    } else {
      if (this.state.subscriptionLevel === 0) {
        this.onPay(planID);
      } else {
        if (this.state.subscriptionLevel === 1) {
          self.setState({
            uSubscribe: 'AlreadyRoulettePlan',
            type: ''
          });
        } else if (this.state.subscriptionLevel === 2) {
          self.setState({
            uSubscribe: 'UsingRouletteBlackJackPlan',
            type: ''
          });
        }
        if (this.state.subscriptionLevel > planID) {
          if (planID === 1) {
            self.setState({
              extraDateText: 'DowngradeRoulettePlan',
              type: ''
            });
          }
        } else if (this.state.subscriptionLevel < planID) {
          if (planID === 1) {
            self.setState({
              extraDateText: 'UpgradeRoulettePlan',
              type: ''
            });
          } else if (planID === 2) {
            self.setState({
              extraDateText: 'UpgradeRouletteBlackJackPlan',
              type: ''
            });
          }
        }
        if (planID === 1) {
          self.toggle_in2();
        } else if (planID === 2) {
          self.toggle_in2();
        }
      }
    }
  }

  onPay = (planID) => {
    let self = this;
    this.setState({
      isUpDownModalOpen: false,
      loading: true,
      type: ''
    })

    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    let pre_subscription_desc = 'eu';
    var billingPlanAttributes = {
      "description": "Create Plan for Roulette",
      "merchant_preferences": {
        "auto_bill_amount": "yes",
        "cancel_url": APIUrl + "cancel",
        "initial_fail_amount_action": "continue",
        "max_fail_attempts": "1",
        "return_url": APIUrl + "success",
      },
      "name": "Roulette",
      "payment_definitions": [
        {
          "amount": {
              "currency": "USD",
              "value": this.state.pro_price
          },
          "cycles": "0",
          "frequency": "MONTH",
          "frequency_interval": "1",
          "name": "Regular 1",
          "type": "REGULAR"
        },
      ],
      "type": "INFINITE"
    };

    if (planID == 2) {
      billingPlanAttributes.description = 'Create Plan for Roulette + BlackJack';
      billingPlanAttributes.name = 'Roulette + BlackJack';
      billingPlanAttributes.payment_definitions[0].amount.value = this.state.extreme_price;
    } else if (planID == 3) {
      billingPlanAttributes.description = 'Create Plan for All You Can Access';
      billingPlanAttributes.name = 'All You Can Access';
      billingPlanAttributes.payment_definitions[0].amount.value = this.state.robot_price;
    }

    PaymentService.pay({user_id: userinfo.id, pre_subscription: planID, pre_subscription_desc: pre_subscription_desc, billingPlanAttributes: billingPlanAttributes}).then(async(res)=> {
      if (res.data.success) {
        let redirect_url = res.data.result;
        window.location.href = redirect_url;
      } else {
        console.log('fail');
        self.setState({
          loading: false,
          type: "error",
          message: "Erroneous payment OR failed to load script! Try again."
        })
      }
    })
  }

  toggle_in = () => {
    this.setState({
      isCancelModalOpen: true,
      type: ''
    })
  }

  toggle_out = () => {
    this.setState({
      isCancelModalOpen: false,
      type: ''
    })
  }

  toggle_in2 = () => {
    this.setState({
      isUpDownModalOpen: true,
      type: ''
    })
  }

  toggle_out2 = () => {
    this.setState({
      isUpDownModalOpen: false,
      type: ''
    })
  }

  toggle_in3 = () => {
    this.setState({
      isUpDownRobotModalOpen: true,
      type: ''
    })
  }

  toggle_out3 = () => {
    this.setState({
      isUpDownRobotModalOpen: false,
      type: ''
    })
  }
  
  handleChange = (name, value) => {
    this.setState({ [name]: value, type: '' });
    this.update_status = true;
  }

  onSubmitSuperUser = async() => {
    if (this.state.youtube_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.youtube_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Youtube account URL is not valid URL!"
      });
      return;
    } else if (this.state.twitch_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.twitch_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Twitch account URL is not valid URL!"
      });
      return;
    } else if (this.state.vimeo_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.vimeo_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Vimeo account URL is not valid URL!"
      });
      return;
    } else if (this.state.discord_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.discord_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Discord account URL is not valid URL!"
      });
      return;
    } else if (!this.state.youtube_account_url && !this.state.twitch_account_url && !this.state.vimeo_account_url && !this.state.discord_account_url) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Please enter your account URL!"
      });
      return;
    }
    if (!this.state.isCheckedTAP) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Please Check Terms and Policy!"
      });
      return;
    }
    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    let self = this;
    let data = {
      youtube_account_url: this.state.youtube_account_url,
      twitch_account_url: this.state.twitch_account_url,
      vimeo_account_url: this.state.vimeo_account_url,
      discord_account_url: this.state.discord_account_url
    }
    try {
      const res = await UserService.update_profile({id: userinfo['id'], super_user: 1, streaming_account: JSON.stringify(data)});
      if (res.data.success) {
        this.setState({
          title: "Result",
          type: "success",
          message: "Your account will be reviewed  within 24 hours.",
          isSuperUserModalOpen: false
        });
        this.showToastr();
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
      } else {
        this.setState({
          title: "Result",
          type: "error",
          message: res.data.error,
          isSuperUserModalOpen: false
        });
        console.log('fail');
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error,
        isSuperUserModalOpen: false
      });
    }
  }

  render() {
    const { subscriptionLevel, isSuperuser, isCheckedTAP, youtube_account_url, twitch_account_url, vimeo_account_url, discord_account_url } = this.state;
    return (
      <Container fluid className="p-3 landing-intro1" style={{marginTop: '-1rem'}}>
        {
        !this.state.loading ? (
          <div>
            <p className="per-price mt-5 text-center"><Translation>{(t, { i18n }) => <>{t(this.state.isApple)}</>}</Translation>{this.state.expired_datetime}</p>
            <Row className="p-3">
              <Col xl="3" lg="6" md="6" className="mb-5 mt-5">
                {
                  subscriptionLevel === 1 && (
                    <div className="current-plan-title float-right">
                      <h3 className="title-style"><Translation>{(t, { i18n }) => <>{t('CurrentPlan')}</>}</Translation></h3>
                    </div>
                  )
                }
                <div className={'current-plan-body'}>
                  <Card className="flex-fill w-100 pay-plan11 mb-0">
                    <CardBody>
                      <div className="text-center">
                        <Button size="lg" className="Pay-professional">
                          <span className="Day-pass"><Translation>{(t, { i18n }) => <>{t('RoulettePlan')}</>}</Translation></span>
                        </Button>
                        <div className="mt-5 mb-5 mr-auto ml-auto">
                          <img src={professional} className="professional-key"/>
                        </div>
                        <p className="per-price">${this.state.pro_price} <Translation>{(t, { i18n }) => <>{t('PerMonth')}</>}</Translation></p>
                        <div className="text-center">
                          {
                            subscriptionLevel === 1 && this.flgSubscribe? (
                              <Button className="Pay-cancel" onClick={this.toggle_in}><Translation>{(t, { i18n }) => <>{t('Unsubscribe')}</>}</Translation></Button>
                            ) : (
                              <Button className="Pay-cancel" onClick={() => this.onSelectPlan(1)}><Translation>{(t, { i18n }) => <>{t('SubscribeNow')}</>}</Translation></Button>
                            )
                          }
                        </div>
                        <p className="per-day mt-4 mb-4"><Translation>{(t, { i18n }) => <>{t('NoCommitment')}</>}</Translation></p>
                      </div>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 text-white float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left text-white "><Translation>{(t, { i18n }) => <>{t('FullRouletteAccess')}</>}</Translation></p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col xl="3" lg="6" md="6" className="mb-5 mt-5">
                {
                  subscriptionLevel === 2 && (
                    <div className="current-plan-title1 float-right">
                      <h3 className="title-style"><Translation>{(t, { i18n }) => <>{t('CurrentPlan')}</>}</Translation></h3>
                    </div>
                  )
                }
                <div className={'current-plan-body1'}>
                  <Card className="flex-fill w-100 pay-plan22 mb-0">
                    <CardBody>
                      <div className="text-center">
                        <Button size="lg" className="Pay-professional">
                          <span className="Day-pass"><Translation>{(t, { i18n }) => <>{t('RouletteBlackJackPlan')}</>}</Translation></span>
                        </Button>
                        <div className="mt-5 mb-5 mr-auto ml-auto">
                          <img src={extreme} className="extreme-cup"/>
                        </div>
                        <p className="per-price">${this.state.extreme_price} <Translation>{(t, { i18n }) => <>{t('PerMonth')}</>}</Translation></p>
                        
                        <div className="text-center">
                          {
                            subscriptionLevel === 2 && this.flgSubscribe ? (
                              <Button className="Pay-cancel" onClick={this.toggle_in}><Translation>{(t, { i18n }) => <>{t('Unsubscribe')}</>}</Translation></Button>
                            ) : (
                              <Button className="Pay-cancel" onClick={() => this.onSelectPlan(2)}><Translation>{(t, { i18n }) => <>{t('SubscribeNow')}</>}</Translation></Button>
                            )
                          }
                        </div>
                        <p className="per-day mt-4 mb-4"><Translation>{(t, { i18n }) => <>{t('NoCommitment')}</>}</Translation></p>
                      </div>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('FullRouletteAccess')}</>}</Translation></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('FullBlackJackAccess')}</>}</Translation> 🔥</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('EuropeanRouletteMobile')}</>}</Translation></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('AmericanRouletteMobile')}</>}</Translation></p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col xl="3" lg="6" md="6" className="mb-5 mt-5">
                {
                  subscriptionLevel === 3 && (
                    <div className="current-plan-title1 float-right">
                      <h3 className="title-style"><Translation>{(t, { i18n }) => <>{t('CurrentPlan')}</>}</Translation></h3>
                    </div>
                  )
                }
                <div className={'current-plan-body1'}>
                  <Card className="flex-fill w-100 pay-plan22 mb-0">
                    <CardBody>
                      <div className="text-center">
                        <Button size="lg" className="Pay-extreme">
                          <span className="Day-pass"><Translation>{(t, { i18n }) => <>{t('AllAccessPlan')}</>}</Translation></span>
                        </Button>
                        <div className="mt-5 mb-5 mr-auto ml-auto">
                          <img src={extreme_robot} className="extreme-cup"/>
                        </div>
                        <p className="per-price">${this.state.robot_price} <Translation>{(t, { i18n }) => <>{t('PerMonth')}</>}</Translation></p>
                        
                        <div className="text-center">
                          {
                            subscriptionLevel === 3 && this.flgSubscribe ? (
                              <Button className="Pay-cancel" onClick={this.toggle_in}><Translation>{(t, { i18n }) => <>{t('Unsubscribe')}</>}</Translation></Button>
                            ) : (
                              <Button className="Pay-cancel" onClick={() => this.onSelectPlan(3)}><Translation>{(t, { i18n }) => <>{t('SubscribeNow')}</>}</Translation></Button>
                            )
                          }
                        </div>
                        <p className="per-day mt-4 mb-4"><Translation>{(t, { i18n }) => <>{t('NoCommitment')}</>}</Translation></p>
                      </div>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('FullRouletteAccess')}</>}</Translation></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('FullBlackJackAccess')}</>}</Translation> 🔥</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('FullBaccaratAccess')}</>}</Translation> 🔥</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('EuropeanRouletteMobile')}</>}</Translation></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('AmericanRouletteMobile')}</>}</Translation></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('RouletteRobotAccess')}</>}</Translation> 🔥</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                          <p className="month-501 float-left "><Translation>{(t, { i18n }) => <>{t('RouletteRobotDownload')}</>}</Translation> <Link to="/assets/Roulette_Robot.app.zip" target="_blank" download className="download_zip"><FontAwesomeIcon className="align-middle" icon={faDownload} fixedWidth /></Link></p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col xl="3" lg="6" md="6" className="mb-5 mt-5">
                {
                  isSuperuser > 1 && (
                    <div className="current-plan-title1 float-right">
                      <h3 className="title-style"><Translation>{(t, { i18n }) => <>{t('CurrentPlan')}</>}</Translation></h3>
                    </div>
                  )
                }
                <div className={'current-plan-body1'}>
                  <Card className="flex-fill w-100 pay-plan22 mb-0">
                    <CardBody>
                      <div className="text-center">
                        <Button size="lg" className="Pay-extreme" style={{opacity: 0}}>
                          <span className="Day-pass"><Translation>{(t, { i18n }) => <>{t('AllAccessPlan')}</>}</Translation></span>
                        </Button>
                        <div className="mt-5 mb-5 mr-auto ml-auto">
                          <img src={partnership} className="extreme-cup"/>
                        </div>
                        <p className="per-price" style={{opacity: 0}}>$0 <Translation>{(t, { i18n }) => <>{t('PerMonth')}</>}</Translation></p>
                        
                        <div className="text-center">
                          {
                            isSuperuser > 1 ? (
                              <Button className="Become-superuser-btn"><Translation>{(t, { i18n }) => <>{t('ISuperuser')}</>}</Translation></Button>
                            ) : (
                            <>
                            {
                              isSuperuser == 1 ? (
                                <Button className="Become-superuser-btn">
                                  <Translation>{(t, { i18n }) => <>{t('InProgress')}</>}</Translation>
                                </Button>
                              ) : (
                                <Button className="Become-superuser-btn" onClick={() => this.setState({isSuperUserModalOpen: true, type: ''})}>
                                  <Translation>{(t, { i18n }) => <>{t('BecomeSuperuser')}</>}</Translation>
                                </Button>
                              )
                            }
                            </>
                            )
                          }
                        </div>
                        <p className="per-day1 mt-4 mb-4" style={{opacity: 0}}><Translation>{(t, { i18n }) => <>{t('NoCommitment')}</>}</Translation></p>
                      </div>
                      <div className="text-justify">
                        <p className="per-day1 mt-4 mb-4 pr-3 pl-3 text-justify"><Translation>{(t, { i18n }) => <>{t('SuperuserComment1')}</>}</Translation></p>
                        <p className="per-day1 mt-4 mb-4 pr-3 pl-3 text-justify"><Translation>{(t, { i18n }) => <>{t('SuperuserComment2')}</>}</Translation></p>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="remember"><Translation>{(t, { i18n }) => <>{t('Remember')}</>}</Translation></p>
                <p className="Were-On-Your-Side"><Translation>{(t, { i18n }) => <>{t('YourSide')}</>}</Translation></p>
              </Col>
            </Row>
            <div>
              <Modal isOpen={this.state.isCancelModalOpen} toggle={this.toggle_out} backdrop={'static'} centered={true} size="md">
                <ModalHeader toggle={this.toggle_out}><Translation>{(t, { i18n }) => <>{t('Alert')}</>}</Translation></ModalHeader>
                <ModalBody>
                  <div>
                    <h3 className="mb-3 text-center"><Translation>{(t, { i18n }) => <>{t('CancelPlanComment')}</>}</Translation></h3>
                    <h3 className="mb-5 text-center"><Translation>{(t, { i18n }) => <>{t('StillActiveComment')}</>}</Translation></h3>
                    <Row>
                      <Col className="text-center align-self-center">
                        <Button className="Back-btn" size="lg" onClick={this.toggle_out}><Translation>{(t, { i18n }) => <>{t('No')}</>}</Translation></Button>
                      </Col>
                      <Col className="text-center">
                        <Button size="lg" className="Pay" onClick={this.onCancel}><Translation>{(t, { i18n }) => <>{t('Yes')}</>}</Translation></Button>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
              </Modal>
            </div>
            <div>
              <Modal isOpen={this.state.isUpDownModalOpen} toggle={this.toggle_out} backdrop={'static'} centered={true} size="md">
                <ModalHeader toggle={this.toggle_out2}><Translation>{(t, { i18n }) => <>{t('Notification')}</>}</Translation></ModalHeader>
                <ModalBody>
                  <div>
                    <h3 className="mb-3 text-center"><Translation>{(t, { i18n }) => <>{t(this.state.uSubscribe)}</>}</Translation></h3>
                    <h3 className="mb-5 text-center"><Translation>{(t, { i18n }) => <>{t(this.state.extraDateText)}</>}</Translation></h3>
                    <Row>
                      <Col className="text-center align-self-center">
                        <Button className="Back-btn" size="lg" onClick={this.toggle_out2}><Translation>{(t, { i18n }) => <>{t('No')}</>}</Translation></Button>
                      </Col>
                      <Col className="text-center">
                        <Button size="lg" className="Pay" onClick={() => this.onPay(this.state.planID)}><Translation>{(t, { i18n }) => <>{t('Yes')}</>}</Translation></Button>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
              </Modal>
            </div>
            <div>
              <Modal isOpen={this.state.isUpDownRobotModalOpen} toggle={this.toggle_out} backdrop={'static'} centered={true} size="md">
                <ModalBody>
                  <div>
                    <h3 className="mt-3 mb-1 text-center" style={{color: '#ff0000'}}><b><Translation>{(t, { i18n }) => <>{t('Attention')}</>}</Translation></b></h3>
                    <h4 className="mb-4 text-center"><Translation>{(t, { i18n }) => <>{t('RouletteRobotSoftwareComment')}</>}</Translation></h4>
                    <Row>
                      <Col className="text-center">
                        <Button size="lg" className="Pay3" onClick={() => this.onPay(this.state.planID)}><Translation>{(t, { i18n }) => <>{t('ConfirmPay')}</>}</Translation></Button>
                      </Col>
                      <Col className="text-center align-self-center">
                        <Button className="Back-btn" size="lg" onClick={this.toggle_out3}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
              </Modal>
            </div>
            <div>
              <Modal isOpen={this.state.isSuperUserModalOpen} toggle={() => this.setState({isSuperUserModalOpen: false, type: ''})} centered={true} size="md">
                <ModalBody>
                  <div className="p-4">
                    <h3 className="mt-3 mb-4 text-center"><b><Translation>{(t, { i18n }) => <>{t('SuperUserProgramForm')}</>}</Translation></b></h3>
                    <Translation>{(t, { i18n }) => 
                      <>
                        <RedditTextField
                          label={t('YoutubeAccount')}
                          placeholder="https://"
                          className="w-100 mt-3 mb-3"
                          variant="filled"
                          id="youtube_account_url"
                          type="text"
                          name="youtube_account_url"
                          value={youtube_account_url}
                          onChange={(e) => {this.handleChange("youtube_account_url", e.target.value)}}
                        />
                      </>}
                    </Translation>
                    <Translation>{(t, { i18n }) => 
                      <>
                        <RedditTextField
                          label={t('TwitchAccount')}
                          placeholder="https://"
                          className="w-100 mt-3 mb-3"
                          variant="filled"
                          id="twitch_account_url"
                          type="text"
                          name="twitch_account_url"
                          value={twitch_account_url}
                          onChange={(e) => {this.handleChange("twitch_account_url", e.target.value)}}
                        />
                      </>}
                    </Translation>
                    <Translation>{(t, { i18n }) => 
                      <>
                        <RedditTextField
                          label={t('VimeoAccount')}
                          placeholder="https://"
                          className="w-100 mt-3 mb-3"
                          variant="filled"
                          id="vimeo_account_url"
                          type="text"
                          name="vimeo_account_url"
                          value={vimeo_account_url}
                          onChange={(e) => {this.handleChange("vimeo_account_url", e.target.value)}}
                        />
                      </>}
                    </Translation>
                    <Translation>{(t, { i18n }) => 
                      <>
                        <RedditTextField
                          label={t('DiscordAccount')}
                          placeholder="https://"
                          className="w-100 mt-3 mb-3"
                          variant="filled"
                          id="discord_account_url"
                          type="text"
                          name="discord_account_url"
                          value={discord_account_url}
                          onChange={(e) => {this.handleChange("discord_account_url", e.target.value)}}
                        />
                      </>}
                    </Translation>
                    <h3 className="mt-3 mb-4 text-justify" style={{color: '#ff0000'}}><b><Translation>{(t, { i18n }) => <>{t('StreamingAccountComment')}</>}</Translation></b></h3>
                    <div className="text-left">
                      <div className="filter-selector mb-3 d-flex">
                        <div>
                          <CustomInput
                            type="checkbox"
                            id="check_tap"
                            checked={isCheckedTAP ? true : false}
                            onChange={(e) => {this.handleChange("isCheckedTAP", e.target.checked)}}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <span className="By-checking-the-box"><Translation>{(t, { i18n }) => <>{t('UnderstandChecking')}</>}</Translation>  <a href="https://bigdata666.net/pages/terms" className="TAP" target="blank"><Translation>{(t, { i18n }) => <>{t('MoreTermsConditions')}</>}</Translation></a></span>
                        </div>
                      </div>
                    </div>
                    <Row>
                      <Col className="text-center align-self-center">
                        <Button size="lg" onClick={() => this.setState({isSuperUserModalOpen: false, type: ''})} style={{backgroundColor: '#C4C4C4', borderColor: '#C4C4C4', color: '#fff'}}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                      </Col>
                      <Col className="text-center">
                        <Button size="lg" style={{backgroundColor: '#30D066', borderColor: '#30D066', color: '#fff'}} onClick={this.onSubmitSuperUser}><Translation>{(t, { i18n }) => <>{t('Submit')}</>}</Translation></Button>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        ) : (
          <div className="ballbeat text-center">
            <BallBeat
              color={'#000'}
              loading={this.state.loading}
            />
          </div>
        )
      }
      </Container>
    );
  }
}

export default Pricing;
