import React, { Component, useState } from "react";
import { toastr } from "react-redux-toastr";
import {
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
  Card,
  CardBody,
} from "reactstrap";
import { useTranslation, Translation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { fade, makeStyles } from '@material-ui/core/styles';
import { InputAdornment, withStyles } from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { Auth } from 'aws-amplify';
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import esFlag from "../../assets/img/flags/es.png";
import rouletteDashboardAnalysis from "../../assets/img/Roulette_Dashboard_Analysis.png";
import * as UserService from '../../action/user';

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

const styles = theme => ({
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
});

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordIsMasked: true,
    };
  }

  togglePasswordMask = () => {
    this.setState(prevState => ({
      passwordIsMasked: !prevState.passwordIsMasked,
    }));
  };

  render() {
    const { classes } = this.props;
    const { passwordIsMasked } = this.state;

    return (
      <TextField
        type={passwordIsMasked ? 'password' : 'text'}
        {...this.props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityOutlinedIcon
                className={classes.eye}
                onClick={this.togglePasswordMask}
              />
            </InputAdornment>
          ),
        }}
      />
    );
  }
}

PasswordInput = withStyles(styles)(PasswordInput);
        
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
      <Container>
        <NavbarBrand href="/" className="d-none d-md-block">
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
              <span className="How-it-works-Pricing">{t('Pricing')}</span>
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

const Intro = ({ confirm_email, change_pass, signin_status }) => {
  const { t } = useTranslation();
  const [reset_status, setReset_status] = useState(false);
  const [verify_email, setVerify_email] = useState('');
  const [verification_code, setVerification_code] = useState('');
  const [confirmed_email, setConfirmed_email] = useState('');
  const [reset_password, setReset_password] = useState('');

  const change = () => {
    setReset_status(!reset_status);
  }

  const handleEmailChange = (e) => {
    setVerify_email(e.target.value);
  }

  const keyPress1 = (e) => {
    if (e.keyCode === 13) {
      confirmEmail();
    }
  }

  const confirmEmail = () => {
    setReset_status(!reset_status);
    let send_email = {};
    send_email['email'] = verify_email;
    confirm_email(send_email);
  }

  const verificationcodeChange = (e) => {
    setVerification_code(e.target.value);
  }

  const emailChange = (e) => {
    setConfirmed_email(e.target.value);
  }

  const passChange = (e) => {
    setReset_password(e.target.value);
  }

  const keyPress2 = (e) => {
    if (e.keyCode === 13) {
      changePass();
    }
  }

  const changePass = () => {
    let reset_data = {};
    reset_data['code'] = verification_code;
    reset_data['email'] = verify_email;
    reset_data['password'] = reset_password;
    change_pass(reset_data);
  }

  return (
    <section className="landing-intro p-5">
      <Container>
        {
          signin_status ? (
            <Row>
              <Col xl="7" lg="7" className=" text-center" style={{paddingTop: 150, paddingRight: 80, paddingLeft: 80}}>
                <span className="A-professional-roule">
                  A professional roulette-game data analytic app by <span className="text-style-1">gamers</span> for <span className="text-style-1">gamers</span>.
                </span>
              </Col>
              <Col xl="5" lg="5" className="mt-5 mb-5">
                <h3 className="loged-in-style-1 mb-3">You are Loged In. Go To <a href="/" className="go-to-dashboard"><span className="go-to-dashboard"> Dashboard</span></a></h3>
                <img src={rouletteDashboardAnalysis} alt="Roulette Dashboard Analysis" className="img-thumbnail w-100" />
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xl="7" lg="7" className=" text-center" style={{paddingTop: 10, paddingRight: 80, paddingLeft: 80}}>
              {
                !reset_status ? (
                  <div>
                    <p className="text-style-1">{t('ForgotYourPassword')}</p>
                    <span className="A-professional-roule">{t('EmailAddressAssociated')}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-style-1">{t('SetNewPassword')}</p>
                    <span className="A-professional-roule">{t('EmailNewPasswordLetters')}</span>
                  </div>
                )
              }

              </Col>
              <Col xl="5" lg="5">
                {
                  !reset_status ? (
                    <div>
                      <Card className="flex-fill w-100 landing-signin-out">
                        <CardBody>
                          <RedditTextField
                            label={t('Email')}
                            className="w-100 mt-3 mb-3"
                            variant="filled"
                            id="verify_email"
                            type="email"
                            name="verify_email"
                            defaultValue={verify_email}
                            onKeyDown={keyPress1}
                            onChange={handleEmailChange}
                          />
                          <hr/>
                          <Row>
                            <Col lg="4" md="4" sm="4" xs="4" className="text-center align-self-center" >
                              <Button className="Back-btn" size="lg" href="/">
                                {t('Back')}
                              </Button>
                            </Col>
                            <Col lg="8" md="8" sm="8" xs="8" className="text-center" >
                              <Button className="Confirm-email-btn" size="lg" onClick={confirmEmail}>
                                {t('ConfirmEmail')}
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      <Row>
                        <Col xl="6" lg="6" md="6" sm="12" xs="12" className="p-2 text-center">
                          <Button className="app-store" />
                        </Col>
                        <Col xl="6" lg="6" md="6" sm="12" xs="12" className="p-2 text-center">
                          <Button className="google-play" />
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div>
                      <Card className="flex-fill w-100 text-center landing-signin-out">
                        <CardBody>
                          <div className="text-center">
                            <RedditTextField
                              label={t('EnterVerificationCode')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="verification_code"
                              type="text"
                              name="verification_code"
                              defaultValue={verification_code}
                              onKeyDown={keyPress2}
                              onChange={verificationcodeChange}
                            />
                            <RedditTextField
                              label={t('Email')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="confirmed_email"
                              type="text"
                              name="confirmed_email"
                              defaultValue={verify_email}
                              onKeyDown={keyPress2}
                              onChange={emailChange}
                              disabled={true}
                            />
                            <PasswordInput
                              label={t('Password')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="reset_password"
                              name="reset_password"
                              value={reset_password}
                              onKeyDown={keyPress2}
                              onChange={passChange}
                            />
                          </div>
                          <hr/>
                          <Row>
                            <Col lg="6" md="6" sm="6" xs="6">
                              <Button className="Back-btn" size="lg" onClick={change}>
                                {t('Back')}
                              </Button>
                            </Col>
                            <Col lg="6" md="6" sm="6" xs="6">
                              <Button className="Sign-up-btn" size="lg" onClick={changePass}>
                                {t('ResetPassword')}
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      <Row>
                        <Col xl="6" lg="6" md="6" sm="12" xs="12" className="p-2 text-center">
                          <Button className="app-store" />
                        </Col>
                        <Col xl="6" lg="6" md="6" sm="12" xs="12" className="p-2 text-center">
                          <Button className="google-play" />
                        </Col>
                      </Row>
                    </div>
                  )
                }
              </Col>
            </Row>
          )
        }
      </Container>
    </section>
  )
}

class LandingTutorial extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: usFlag,
      title: "Reset result",
      message: "Hello!",
      type: "success",
      timeOut: 5000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      signin_status: false,
    };
  }

  componentDidMount() {
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

  confirm_email = async(data) => {
    let self = this;
    
    if(!data.email) {
      self.setState({
        type: "error",
        message: "Please Insert Your Email!"
      });
      return;
    } else {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(data.email.toLowerCase())) {
        self.setState({
          type: "error",
          message: "The Email entered is not valid!"
        });
        return;
      }
    }

    const email = data.email;

    try {
      await Auth.forgotPassword(email);
    } catch(error) {
      this.setState({
        type: "error",
        message: error.message
      });
    }
  }

  change_pass = async(data) => {
    let self = this;

    if (!data.code) {
      self.setState({
        type: "error",
        message: "Please Input Verification Code!"
      });
      return;
    }

    if (!data.email) {
      self.setState({
        type: "error",
        message: "Please Insert Your Email!"
      });
      return;
    } else {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(data.email.toLowerCase())) {
        self.setState({
          type: "error",
          message: "The Email entered is not valid!"
        });
        return;
      }
    }

    if (!data.password) {
      self.setState({
        type: "error",
        message: "Please Insert Your New Password!"
      });
      return;
    } else if (data.password.length < 8) {
      self.setState({
        type: "error",
        message: "At least 1 number and minimum 8 letters !"
      });
      return;
    }

    let send_data = {};
    send_data['email'] = data.email;
    send_data['password'] = data.password;

    const code = data.code;
    const email = data.email;
    const password = data.password;

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      UserService.reset_password(send_data).then(function(res) {
        if (res.data.success) {
          self.setState({
            type: "success",
            message: "New Password has updated successful!"
          });
          self.showToastr();
          setTimeout(function() {
            window.location.href = '/';
          }, 5000);
        } else {
          self.setState({
            type: "error",
            message: res.data.message
          });
        }
      })
    } catch(error) {
      if (error.code === 'InvalidPasswordException') {
        this.setState({
          type: "error",
          message: 'At least 1 number and minimum 8 letters !'
        });
      } else if (error.code === 'InvalidParameterException') {
        this.setState({
          type: "error",
          message: 'At least 1 number and minimum 8 letters !'
        });
      } else {
        this.setState({
          type: "error",
          message: error.message
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Navigation flag={this.state.flag} select_lang={this.select_lang}  />
        <Intro confirm_email={this.confirm_email} change_pass={this.change_pass} signin_status={this.state.signin_status} />
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

export default LandingTutorial;
