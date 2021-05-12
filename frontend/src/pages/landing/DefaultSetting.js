import React from "react";
import { toastr } from "react-redux-toastr";
import {
  Card,
  CardBody,
  Row,
  Col,
  Container,
  Modal,
  ModalBody,
  Button
} from "reactstrap";
import { useTranslation, Translation } from 'react-i18next';
import roulette_logo from "../../assets/img/Roulette_icon.png";
import blackjack_logo from "../../assets/img/BlackJack_nav_icon.png";
import bacarrat_logo from "../../assets/img/Bacarrat_icon.png";
import * as UserService from '../../action/user';

class DefaultDashboardSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detail_status: 0,
      title: "Login result",
      message: "Have fun storming the castle!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      pro_price: 0,
      extreme_price: 0,
      robot_price: 0,
      isBlockBtnModalOpen: false
    };
  }

  async componentDidMount() {
    if (window.localStorage.getItem('userinfo')) {
      let userinfo = window.localStorage.getItem('userinfo');
      userinfo = JSON.parse(userinfo);
      if (userinfo.default_dashboard == 1) {
        window.location.href = '/roulette';
      } else if (userinfo.default_dashboard == 2) {
        window.location.href = '/blackjack';
      } else if (userinfo.default_dashboard == 3) {
        window.location.href = '/baccarat';
      }
    } else {
      window.location.href = '/';
    }
  }

  componentDidUpdate() {
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

  setDefaultDashboardPage = (value) => {
    let send_data = {};
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    if (value > 1) {
      if (value == 4) {
        window.open('https://bigdata666.net', '_blank');
      } else {
        if (userinfo['subscription'] < 2) {
          this.setState({
            isBlockBtnModalOpen: true,
            type: ''
          })
        } else {
          this.setState({
            detail_status: value
          });
          send_data['id'] = userinfo['id'];
          send_data['default_dashboard'] = value;
          UserService.update_profile(send_data).then(function(res) {
            if (res.data.success) {
              window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
              setTimeout(function() {
                if (value == 2) {
                  window.location.href = '/blackjack';
                } else if (value == 3) {
                  window.location.href = '/baccarat';
                }
              }, 2000);
            } else {
              console.log('fail');
            }
          })
        }
      }
    } else {
      this.setState({
        detail_status: value
      });
      send_data['id'] = userinfo['id'];
      send_data['default_dashboard'] = value;
      UserService.update_profile(send_data).then(function(res) {
        if (res.data.success) {
          window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
          setTimeout(function() {
            window.location.href = '/roulette';
          }, 2000);
        } else {
          console.log('fail');
        }
      })
    }
  }

  movePricing = () => {
    let send_data = {};
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    send_data['id'] = userinfo['id'];
    send_data['default_dashboard'] = 1;
    UserService.update_profile(send_data).then(function(res) {
      if (res.data.success) {
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
        window.location.href = '/pricing';
      } else {
        console.log('fail');
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <section className="landing-intro2 p-5">
          <Container className="default-setting-top">
            <Row>
              <Col xl="6" lg="6" md="6" sm="12" className="w-100">
                <Card className="w-100 pre_setting_card" onClick={() => this.setDefaultDashboardPage(1)}>
                  <CardBody>
                    <Row>
                      <Col className="default-setting-col">
                        <img
                          alt="roulette logo"
                          src={roulette_logo}
                          className="rounded img-responsive"
                          width="120"
                          heigth="120"
                        />
                      </Col>
                      <Col className="default-setting-col">
                        <div>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('Roulette')}</>}</Translation></p>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('Dashboard')}</>}</Translation></p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {
                  this.state.detail_status == 1 ? (
                    <div className="mb-4 text-center">
                      <p className="default-setting-title">
                        (<Translation>{(t, { i18n }) => <>{t('Default')}</>}</Translation>)
                      </p>
                      <span className="default-setting-detail">*<Translation>{(t, { i18n }) => <>{t('DefaultStartingPageComment')}</>}</Translation></span>
                    </div>
                  ) : (
                    <></>
                  )
                }
              </Col>
              <Col xl="6" lg="6" md="6" sm="12" className="w-100">
                <Card className="w-100 pre_setting_card" onClick={() => this.setDefaultDashboardPage(2)}>
                  <CardBody>
                    <Row>
                      <Col className="default-setting-col">
                        <img
                          alt="blackjack logo"
                          src={blackjack_logo}
                          className="rounded img-responsive"
                          width="120"
                          heigth="120"
                        />
                      </Col>
                      <Col className="default-setting-col">
                        <div>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('BlackJack')}</>}</Translation></p>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('Dashboard')}</>}</Translation></p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {
                  this.state.detail_status == 2 ? (
                    <div className="mb-4 text-center">
                      <p className="default-setting-title">
                        (<Translation>{(t, { i18n }) => <>{t('Default')}</>}</Translation>)
                      </p>
                      <span className="default-setting-detail">*<Translation>{(t, { i18n }) => <>{t('DefaultStartingPageComment')}</>}</Translation></span>
                    </div>
                  ) : (
                    <></>
                  )
                }
              </Col>
            </Row>
            <Row>
              <Col xl="6" lg="6" md="6" sm="12" className="w-100">
                <Card className="w-100 pre_setting_card" onClick={() => this.setDefaultDashboardPage(3)}>
                  <CardBody>
                    <Row>
                      <Col className="default-setting-col">
                        <img
                          alt="bacarrat logo"
                          src={bacarrat_logo}
                          className="rounded img-responsive"
                          width="120"
                          heigth="120"
                        />
                      </Col>
                      <Col className="default-setting-col">
                        <div>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('Baccarat')}</>}</Translation></p>
                          <p className="align-middle default-setting-col-title"><Translation>{(t, { i18n }) => <>{t('Dashboard')}</>}</Translation></p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {
                  this.state.detail_status == 3 ? (
                    <div className="mb-4 text-center">
                      <p className="default-setting-title">
                        (<Translation>{(t, { i18n }) => <>{t('Default')}</>}</Translation>)
                      </p>
                      <span className="default-setting-detail">*<Translation>{(t, { i18n }) => <>{t('DefaultStartingPageComment')}</>}</Translation></span>
                    </div>
                  ) : (
                    <></>
                  )
                }
              </Col>
              <Col xl="6" lg="6" md="6" sm="12" className="w-100">
                <Card className="w-100 pre_setting_card" onClick={() => this.setDefaultDashboardPage(4)}>
                  <CardBody>
                    <Row>
                      <Col className="default-setting-col">
                        <img
                          alt="roulette logo"
                          src={roulette_logo}
                          className="rounded img-responsive"
                          width="120"
                          heigth="120"
                        />
                      </Col>
                      <Col className="default-setting-col">
                        <div>
                          <p className="align-middle default-setting-col-title1"><Translation>{(t, { i18n }) => <>{t('GuessApp')}</>}</Translation></p>
                          {/* <p className="align-middle default-setting-col-title1"><Translation>{(t, { i18n }) => <>{t('Comming')}</>}</Translation></p> */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <div>
            <Modal isOpen={this.state.isBlockBtnModalOpen} backdrop={'static'} centered={true} size="sm">
              <ModalBody className="text-center pr-3 pl-3">
                <div className="pr-3 pl-3">
                  <h3 className="mt-3 mb-3"><b><Translation>{(t, { i18n }) => <>{t('Sorry')}</>}</Translation></b></h3>
                  <h3 className="mb-3"><Translation>{(t, { i18n }) => <>{t('UpgradePlanComment')}</>}</Translation></h3>
                  <Button className="red_keyboard m-4" onClick={()=>this.setState({isBlockBtnModalOpen: false})}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                  <Button className="green_keyboard m-4" onClick={this.movePricing}><Translation>{(t, { i18n }) => <>{t('ComparePlan')}</>}</Translation></Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default DefaultDashboardSetting;
