import React, { Component, useState } from "react";
import { Link } from 'react-router-dom';
import { toastr } from "react-redux-toastr";
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  Button,
  Modal,
  ModalBody,
} from "reactstrap";
import { useTranslation, Translation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDownload, faTv } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import esFlag from "../../assets/img/flags/es.png";
import professional from "../../assets/img/Professional.png";
import extreme from "../../assets/img/extreme.png";
import extreme_robot from "../../assets/img/Robot.png";
import partnership from "../../assets/img/Partnership.png";
import * as UserService from '../../action/user';
        
const Navigation = ({ flag, select_lang }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang_code) => {
    i18n.changeLanguage(lang_code)
  }

  const select_en = () => {
    select_lang('en');
    changeLanguage('en');
  }

  const select_cn = () => {
    select_lang('cn');
    changeLanguage('cn');
  }

  const select_fr = () => {
    select_lang('fr');
    changeLanguage('fr');
  }

  const select_de = () => {
    select_lang('de');
    changeLanguage('de');
  }

  const select_es = () => {
    select_lang('es');
    changeLanguage('es');
  }

  return (
    <Navbar dark expand className="navbar-landing">
      <Container fluid className="pr-4 pl-4">
        <NavbarBrand href="/" className="d-none d-sm-block">
          <img src={logo} alt={'logo'} width={'200'} className="thumbnail" />
        </NavbarBrand>
        <Nav className="float-right" navbar>
          <UncontrolledDropdown nav inNavbar className="mr-2">
            <DropdownToggle nav caret className="nav-flag">
              <img src={flag} alt="flag" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={select_en}>
                <img
                  src={usFlag}
                  alt="English"
                  width="20"
                  className="align-middle mr-1"
                />
                <span className="align-middle">English</span>
              </DropdownItem>
              <DropdownItem onClick={select_cn}>
                <img
                  src={cnFlag}
                  alt="Chinese"
                  width="20"
                  className="align-middle mr-1"
                />
                <span className="align-middle">中文</span>
              </DropdownItem>
              <DropdownItem onClick={select_fr}>
                <img
                  src={frFlag}
                  alt="Français"
                  width="20"
                  className="align-middle mr-1"
                />
                <span className="align-middle">Français</span>
              </DropdownItem>
              <DropdownItem onClick={select_de}>
                <img
                  src={deFlag}
                  alt="Deutsch"
                  width="20"
                  className="align-middle mr-1"
                />
                <span className="align-middle">Deutsch</span>
              </DropdownItem>
              <DropdownItem onClick={select_es}>
                <img
                  src={esFlag}
                  alt="Español"
                  width="20"
                  className="align-middle mr-1"
                />
                <span className="align-middle">Español</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="pr-3 pl-3">
            <NavLink href="https://bigdata666.net" target="blank" active>
              <span className="How-it-works-Pricing">{t('AboutUs')}</span>
            </NavLink>
          </NavItem>
          <NavItem className="pr-3">
            <NavLink href="/landing-pricing" active>
              <span className="How-it-works-Pricing active">{t('Pricing')}</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/blogs" active>
              <span className="How-it-works-Pricing">{t('Videos')}</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  )
}

const Intro = ({ signin_status, pro_price, extreme_price, robot_price }) => {
  const { t } = useTranslation();
  
  const [subscription, setSubscription] = useState(false);

  const toggle_out = () => {
    setSubscription(!subscription);
  }

  const sign_in = () => {
    window.location.href = '/sign-up';
  }
  return (
    <section className="landing-intro1 p-5">
      <Container fluid className="p-5">
        <Row className=" mb-5">
          <Col>
            <p className="Were-On-The-Same-Si mb-0">{t('Remember')}</p>
            <p className="Were-On-The-Same-Si mb-0">{t('YourSide')}</p>
          </Col>
        </Row>
        <Row className="">
          <Col xl="3" lg="6" md="6" className="p-3">
            <Card className="flex-fill w-100 pay-plan1">
              <CardBody>
                <div className="text-center">
                  <Button size="lg" className="Pay-professional">
                    <span className="Day-pass">{t('RoulettePlan')}</span>
                  </Button>
                  <div className="mt-5 mb-5 mr-auto ml-auto">
                    <img src={professional} className="professional-key"/>
                  </div>
                  <p className="per-price">${pro_price} {t('PerMonth')}</p>
                  
                  {
                    !signin_status && (
                      <Button className="Pay-cancel" onClick={sign_in}>
                        {t('SubscribeNow')}
                      </Button>
                    )
                  }
                  <p className="per-day mt-4 mb-4">{t('NoCommitment')}</p>
                </div>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 text-white float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left text-white ">{t('FullRouletteAccess')}</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="6" md="6" className="p-3">
            <Card className="flex-fill w-100 pay-plan2">
              <CardBody>
                <div className="text-center">
                  <Button size="lg" className="Pay-professional">
                    <span className="Day-pass">{t('RouletteBlackJackPlan')}</span>
                  </Button>
                  <div className="mt-5 mb-5 mr-auto ml-auto">
                    <img src={extreme} className="extreme-cup"/>
                  </div>
                  <p className="per-price">${extreme_price} {t('PerMonth')}</p>
                  
                  {
                    !signin_status && (
                      <Button className="Pay-cancel" onClick={sign_in}>
                        {t('SubscribeNow')}
                      </Button>
                    )
                  }
                  <p className="per-day1 mt-4 mb-4">{t('NoCommitment')}</p>
                </div>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('FullRouletteAccess')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('FullBlackJackAccess')} 🔥</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('EuropeanRouletteMobile')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('AmericanRouletteMobile')}</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="6" md="6" className="p-3">
            <Card className="flex-fill w-100 pay-plan2">
              <CardBody>
                <div className="text-center">
                  <Button size="lg" className="Pay-extreme">
                    <span className="Day-pass">{t('AllAccessPlan')}</span>
                  </Button>
                  <div className="mt-5 mb-5 mr-auto ml-auto">
                    <img src={extreme_robot} className="extreme-cup"/>
                  </div>
                  <p className="per-price">${robot_price} {t('PerMonth')}</p>
                  
                  {
                    !signin_status && (
                      <Button className="Pay-cancel" onClick={sign_in}>
                        {t('SubscribeNow')}
                      </Button>
                    )
                  }
                  <p className="per-day1 mt-4 mb-4">{t('NoCommitment')}</p>
                </div>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('FullRouletteAccess')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('FullBlackJackAccess')} 🔥</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('FullBaccaratAccess')} 🔥</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('EuropeanRouletteMobile')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('AmericanRouletteMobile')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('RouletteRobotAccess')} 🔥</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <p className="month-501 float-right"><FontAwesomeIcon className="align-middle" icon={faCheck} fixedWidth /></p>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <p className="month-501 float-left ">{t('RouletteRobotDownload')} <Link to="/assets/Roulette_Robot.app.zip" target="_blank" download className="download_zip"><FontAwesomeIcon className="align-middle" icon={faDownload} fixedWidth /></Link></p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="6" md="6" className="p-3">
            <Card className="flex-fill w-100 pay-plan2">
              <CardBody>
                <div className="text-center">
                  <Button size="lg" className="Pay-extreme" style={{opacity: 0}}>
                    <span className="Day-pass">{t('AllAccessPlan')}</span>
                  </Button>
                  <div className="mt-5 mb-5 mr-auto ml-auto">
                    <img src={partnership} className="extreme-cup"/>
                  </div>
                  <p className="per-price" style={{opacity: 0}}>$0 {t('PerMonth')}</p>
                  
                  {
                    !signin_status && (
                      <Button className="Become-superuser-btn" onClick={toggle_out}>
                        {t('BecomeSuperuser')}
                      </Button>
                    )
                  }
                  <p className="per-day1 mt-4 mb-4" style={{opacity: 0}}>{t('NoCommitment')}</p>
                </div>
                <div className="text-justify">
                  <p className="per-day1 mt-4 mb-4 pr-3 pl-3 text-justify">{t('SuperuserComment1')}</p>
                  <p className="per-day1 mt-4 mb-4 pr-3 pl-3 text-justify">{t('SuperuserComment2')}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col className="text-center">
            {
              !signin_status && (
                <Button className="Join-For-Free" href="/">{t('JoinForFree')}</Button>
              )
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="Frequently-asked-que"> {t('FrequentlyQuestions')} <a href="https://bigdata666.net" target="blank" className="FAQ">{t('PleaseVisitHere')}</a>.</p>
          </Col>
        </Row>
        <div>
          <Modal isOpen={subscription} toggle={toggle_out} centered={true} size="md">
            <ModalBody>
              <div>
                <h3 className="mt-3 mb-4 text-center"><b>{t('Alert')}</b></h3>
                <h4 className="mb-4 mr-auto ml-auto text-center" style={{maxWidth: '240px'}}>{t('PartnerShipComment')}</h4>
                <Row>
                  <Col className="text-center align-self-center">
                    <Button size="lg" onClick={toggle_out} style={{backgroundColor: '#C4C4C4', borderColor: '#C4C4C4', color: '#fff'}}>{t('Cancel')}</Button>
                  </Col>
                  <Col className="text-center">
                    <Button size="lg" onClick={sign_in} style={{backgroundColor: '#30D066', borderColor: '#30D066', color: '#fff'}}>{t('SignUp')} / {t('Login')}</Button>
                  </Col>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Container>
    </section>
  )
}

class PayPlan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: usFlag,
      signin_status: false,
      title: "Login result",
      message: "Have fun storming the castle!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      pro_price: 0,
      extreme_price: 0,
      robot_price: 0
    };
  }

  async componentDidMount() {
    if (window.localStorage.getItem('i18nextLng')) {
      if (window.localStorage.getItem('i18nextLng') === 'en' || window.localStorage.getItem('i18nextLng') === 'en-US') {
        this.setState({
          flag: usFlag
        })
      } else if (window.localStorage.getItem('i18nextLng') === 'cn') {
        this.setState({
          flag: cnFlag
        })
      } else if (window.localStorage.getItem('i18nextLng') === 'fr') {
        this.setState({
          flag: frFlag
        })
      } else if (window.localStorage.getItem('i18nextLng') === 'de') {
        this.setState({
          flag: deFlag
        })
      } else if (window.localStorage.getItem('i18nextLng') === 'es') {
        this.setState({
          flag: esFlag
        })
      }
    }
    
    if (window.localStorage.getItem('userinfo')) {
      this.setState({
        signin_status: true
      })
    }

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
  }

  select_lang = (lang) => {
    if (lang === 'en') {
      this.setState({
        flag: usFlag
      })
    } else if (lang === 'cn') {
      this.setState({
        flag: cnFlag
      })
    } else if (lang === 'fr') {
      this.setState({
        flag: frFlag
      })
    } else if (lang === 'de') {
      this.setState({
        flag: deFlag
      })
    } else if (lang === 'es') {
      this.setState({
        flag: esFlag
      })
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

  render() {
    return (
      <React.Fragment>
        <Navigation flag={this.state.flag} select_lang={this.select_lang}  />
        <Intro signin_status={this.state.signin_status} pro_price={this.state.pro_price} extreme_price={this.state.extreme_price} robot_price={this.state.robot_price} />
        <div className="w-100 d-flex landing-footer">
          <div className="w-50 d-flex">
            <div className="pr-3 pl-5">
              <a href="https://bigdata666.net/pages/terms" target="blank" className="Terms-Policies-and-Legal"><Translation>{(t, { i18n }) => <>{t('TermsPoliciesLegal')}</>}</Translation></a>
            </div>
            <div className="pr-3 pl-3">
              <a href="mailto: info@bigdata666.com" target="blank" className="Contact-Us"><Translation>{(t, { i18n }) => <>{t('ContactUs')}</>}</Translation></a>
            </div>
          </div>
          <div className="w-50 pr-3 pl-3">
            <span className="All-rights-re-by-Big float-right">© {new Date().getFullYear()} <Translation>{(t, { i18n }) => <> {t('AllRights')} </>}</Translation></span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PayPlan;
