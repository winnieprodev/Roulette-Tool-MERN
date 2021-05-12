import React, { Component, useState } from "react";
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
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Square, CheckSquare } from "react-feather";
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { fade, makeStyles } from '@material-ui/core/styles';
import { InputAdornment, withStyles } from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { Auth } from 'aws-amplify';
import { BallBeat } from 'react-pure-loaders';
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
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

  return (
    <Navbar dark expand className="navbar-landing">
      <Container>
        <NavbarBrand href="/">
          <img src={logo} alt={'logo'} width={'200'} className="thumbnail" />
        </NavbarBrand>
        <Nav className="text-center" navbar>
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
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="pr-3 pl-3">
            <NavLink href="https://bigdata666.net" target="blank" active>
              <span className="How-it-works-Pricing">{t('HowItWorks')}</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/landing-pricing" active>
              <span className="How-it-works-Pricing">{t('Pricing')}</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  )
}

const Intro = ({ sign_in, sign_up, signin_status }) => {
  const { t } = useTranslation();
  const [signup_status, setSignup_status] = useState(false);
  const [signin_email, setSignin_email] = useState('');
  const [signin_pass, setSignin_pass] = useState('');
  const [signup_username, setSignup_username] = useState('');
  const [signup_email, setSignup_email] = useState('');
  const [signup_pass, setSignup_pass] = useState('');
  const [signup_conf_pass, setSignup_conf_pass] = useState('');
  const [isCheckedTAP, setIsCheckedTAP] = useState(false);

  const change = () => {
    setSignup_status(!signup_status);
  }

  const checkTAP = () => {
    setIsCheckedTAP(!isCheckedTAP);
  }

  const handleEmailChange = (e) => {
    setSignin_email(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setSignin_pass(e.target.value);
  }

  const keyPress1 = (e) => {
    if (e.keyCode === 13) {
      signin();
    }
  }

  const signin = () => {
    let signin_data = {};
    signin_data['email'] = signin_email;
    signin_data['password'] = signin_pass;
    sign_in(signin_data);
  }

  const usernameChange = (e) => {
    setSignup_username(e.target.value);
  }

  const emailChange = (e) => {
    setSignup_email(e.target.value);
  }

  const passChange = (e) => {
    setSignup_pass(e.target.value);
  }

  const confPassChange = (e) => {
    setSignup_conf_pass(e.target.value);
  }

  const keyPress2 = (e) => {
    if (e.keyCode === 13) {
      signup();
    }
  }

  const signup = () => {
    let signup_data = {};
    signup_data['username'] = signup_username;
    signup_data['email'] = signup_email;
    signup_data['password'] = signup_pass;
    signup_data['conf_password'] = signup_conf_pass;
    signup_data['tap'] = isCheckedTAP;
    sign_up(signup_data);
  }

  return (
    <section className="landing-intro p-5">
      <Container>
        <Row>
          <Col xl="7" lg="7" className="text-center" style={{paddingTop: 150, paddingRight: 30, paddingLeft: 100}}>
          {
            !signup_status ? (
              <span className="text-style-1">Bring <span className="A-professional-roule">data science</span> out of the lab and into the <span className="A-professional-roule">gaming.</span></span>
            ) : (
              <span className="A-professional-roule">
                BigData666 for gamers – <span className="text-style-1">Data Visualization made easy</span>
              </span>
            )
          }
          </Col>
          {
            signin_status ? (
              <Col xl="5" lg="5" className="mt-5 mb-5">
                <h3 className="loged-in-style-1 mb-3">You are Loged In. Go To <a href="/" className="go-to-dashboard"><span className="go-to-dashboard"> Dashboard</span></a></h3>
                <img src={rouletteDashboardAnalysis} alt="Roulette Dashboard Analysis" className="img-thumbnail w-100" />
              </Col>
            ) : (
              <Col xl="5" lg="5">
                {
                  !signup_status ? (
                    <div>
                      <Card className="flex-fill w-100 landing-signin-out">
                        <CardBody>
                          <RedditTextField
                            label={t('Email')}
                            className="w-100 mt-3 mb-3"
                            variant="filled"
                            id="login_email"
                            type="email"
                            name="login_email"
                            defaultValue={signin_email}
                            onKeyDown={keyPress1}
                            onChange={handleEmailChange}
                          />
                          <PasswordInput
                            label={t('Password')}
                            className="w-100 mt-3 mb-3"
                            variant="filled"
                            id="login_password"
                            name="login_password"
                            value={signin_pass}
                            onKeyDown={keyPress1}
                            onChange={handlePasswordChange}
                          />
                          <div className="text-center mt-3">
                            <Button className="Log-in-btn w-100" size="lg" onClick={signin}>
                              {t('Login')}
                            </Button>
                          </div>
                          <div className="text-center mt-3">
                            <a className="Forgot-account" href="/reset-password">{t('ForgotPassword')}?</a>
                          </div>
                          <hr/>
                          <div className="text-center mt-3">
                            <p className="Create-New-Account" onClick={change}>{t('CreateNewAccount')}</p>
                          </div>
                        </CardBody>
                      </Card>
                      <Row>
                        <Col>
                          <p className="Mobile-version-is-co">{t('NewsComment')}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5 text-right">
                          <Button className="app-store" />
                        </Col>
                        <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5">
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
                              label={t('Username')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="signup_username"
                              type="text"
                              name="signup_username"
                              defaultValue={signup_username}
                              onKeyDown={keyPress2}
                              onChange={usernameChange}
                            />
                            <RedditTextField
                              label={t('Email')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="signup_email"
                              type="text"
                              name="signup_email"
                              defaultValue={signup_email}
                              onKeyDown={keyPress2}
                              onChange={emailChange}
                            />
                            <PasswordInput
                              label={t('Password')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="signup_password"
                              name="signup_password"
                              value={signup_pass}
                              onKeyDown={keyPress2}
                              onChange={passChange}
                            />
                            <PasswordInput
                              label={t('ConfirmPassword')}
                              className="w-100 mt-3 mb-3"
                              variant="filled"
                              id="signup_confirm_password"
                              name="signup_confirm_password"
                              value={signup_conf_pass}
                              onKeyDown={keyPress2}
                              onChange={confPassChange}
                            />
                          </div>
                          <div className="text-left">
                          {
                            !isCheckedTAP ? (
                              <div className="filter-selector mb-3 d-flex">
                                <div>
                                  <Square size={25} className="align-middle mr-3" style={{color: '#979797', cursor: 'pointer'}} onClick = {checkTAP} />
                                </div>
                                <div>
                                  <span className="By-checking-the-box">By checking this box I acknowledge that I have read, understand, and agree to the  <a href="https://bigdata666.net/pages/terms" className="TAP" target="blank">Terms & Conditions, Policies, Waiver, Indemnification, and Release Of Liability Agreement.</a></span>
                                </div>
                              </div>
                            ) : (
                              <div className="filter-selector mb-3 d-flex">
                                <div>
                                  <CheckSquare size={25} className="align-middle mr-3" style={{color: '#0028ff', cursor: 'pointer'}} onClick = {checkTAP} />
                                </div>
                                <div>
                                  <span className="By-checking-the-box">By checking this box I acknowledge that I have read, understand, and agree to the  <a href="https://bigdata666.net/pages/terms" className="TAP" target="blank">Terms & Conditions, Policies, Waiver, Indemnification, and Release Of Liability Agreement.</a></span>
                                </div>
                              </div>
                            )
                          }
                          </div>
                          <Row>
                            <Col lg="6" md="6" sm="6" xs="6">
                              <Button className="Back-btn" size="lg" onClick={change}>
                                {t('Back')}
                              </Button>
                            </Col>
                            <Col lg="6" md="6" sm="6" xs="6">
                              <Button className="Sign-up-btn" size="lg" onClick={signup}>
                                {t('SignUp')}
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      <Row>
                        <Col>
                          <p className="Mobile-version-is-co">{t('NewsComment')}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5 text-right">
                          <Button className="app-store" />
                        </Col>
                        <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5">
                          <Button className="google-play" />
                        </Col>
                      </Row>
                    </div>
                  )
                }
              </Col>
            )
          }
        </Row>
      </Container>
    </section>
  )
}

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: usFlag,
      signin_status: false,
      title: "Login result",
      message: "Hello!",
      type: "success",
      timeOut: 4000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      loading: false,
      isResigterModalOpen: false
    };
  }

  async componentDidMount() {
    if (window.localStorage.getItem('i18nextLng')) {
      if (window.localStorage.getItem('i18nextLng') === 'en' || window.localStorage.getItem('i18nextLng') === 'en-US') {
        this.setState({
          flag: usFlag
        })
      } else {
        this.setState({
          flag: cnFlag
        })
      }
    }
    if (window.localStorage.getItem('userinfo')) {
      this.setState({
        signin_status: true
      })
    }
    
    // const session = await Auth.currentSession();
    // const user = await Auth.currentAuthenticatedUser();
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
    } else {
      this.setState({
        flag: cnFlag
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

  sign_in = async(data) => {
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

    if (!data.password) {
      self.setState({
        type: "error",
        message: "Please Insert Your Password!"
      });
      return;
    }

    this.setState({
      loading: true,
      type: ''
    })

    const username = data.email;
    const password = data.password;
    
    try {
      await Auth.signIn(username, password);
      UserService.login_user(data).then(function(res) {
        if (res.data.success) {
          self.setState({
            type: "success",
            message: "Welcome to Our Website!",
            loading: false
          });
          self.showToastr();
          setTimeout(function() {
            window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
            window.location.href = '/';
          }, 4000);
        } else {
          self.setState({
            type: "error",
            message: res.data.message,
            loading: false
          });
        }
      })
    } catch(error) {
      this.setState({
        type: "error",
        message: error.message,
        loading: false
      });
    }
  }

  sign_up = async(data) => {
    let self = this;

    if (!data.username) {
      self.setState({
        type: "error",
        message: "Please Insert Your Username!"
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
        message: "Please Insert Your Password!"
      });
      return;
    } else {
      if(data.conf_password !== data.password) {
        self.setState({
          type: "error",
          message: "Password is not same as Confirm Password!"
        });
        return;
      }
    }

    if (!data.tap) {
      self.setState({
        type: "error",
        message: "Please Check Terms and Policy!"
      });
      return;
    }
    
    this.setState({
      loading: true,
      type: ''
    })

    let send_data = {};
    send_data['username'] = data.username;
    send_data['email'] = data.email;
    send_data['password'] = data.password;
    send_data['conf_password'] = data.conf_password;

    const username = data.username;
    const email = data.email;
    const password = data.password;

    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: email
        }
      });
      UserService.register_user(send_data).then(function(res){
        if (res.data.success) {
          self.toggle_in();
        } else {
          self.setState({
            type: "error",
            message: res.data.message,
            loading: false
          });
        }
      })
    } catch(error) {
      this.setState({
        type: "error",
        message: error.message,
        loading: false
      });
    }
  }

  toggle_out = () => {
    this.setState({
      isResigterModalOpen: false,
      type: ''
    })
  }

  toggle_in = () => {
    this.setState({
      isResigterModalOpen: true,
      type: ''
    })
  }

  render() {
    return (
      <React.Fragment>
        {
          !this.state.loading ? (
            <div>
              <Navigation flag={this.state.flag} select_lang={this.select_lang} />
              <Intro sign_in={this.sign_in} sign_up={this.sign_up} signin_status={this.state.signin_status} />
              <div className="w-100 d-flex landing-footer">
                <div className="w-50 d-flex">
                  <div className="pr-3 pl-5">
                    <a href="https://bigdata666.net/pages/terms" target="blank" className="Terms-Policies-and-Legal">Terms, Policies and Legal</a>
                  </div>
                  <div className="pr-3 pl-3">
                    <a href="mailto: info@bigdata666.com" target="blank" className="Contact-Us">Contact Us</a>
                  </div>
                </div>
                <div className="w-50 pr-3 pl-3">
                  <span className="All-rights-re-by-Big float-right">© {new Date().getFullYear()} All rights reserved by BigData666</span>
                </div>
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
        <div>
          <Modal isOpen={this.state.isResigterModalOpen} toggle={this.toggle_out} backdrop={'static'} centered={true} size="md">
            <ModalHeader toggle={this.toggle_out}>Result</ModalHeader>
            <ModalBody>
              <div>
                <h3 className="mb-3">You have successfully registered a new account.</h3>
                <h3 className="mb-3">We've sent you a Email. Please click on the confirmation link to verify your account!</h3>
                <h3 className="mb-3 text-center">Go To <a href="/landing" className="go-to-dashboard"><span className="go-to-dashboard"> SignIn page</span></a></h3>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default Landing;
