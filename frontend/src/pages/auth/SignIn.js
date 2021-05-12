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
  Button
} from "reactstrap";
import { useTranslation, Translation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { fade, makeStyles } from '@material-ui/core/styles';
import { InputAdornment, withStyles } from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { Auth } from 'aws-amplify';
import { BallBeat } from 'react-pure-loaders';
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import esFlag from "../../assets/img/flags/es.png";
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
    <Navbar dark expand className="navbar-landing d-lg-none">
      <Container>
        <NavbarBrand href="/" className="d-none d-md-block">
          <img src={logo} alt={'logo'} width={'200'} className="thumbnail" />
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
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

const Navigation1 = ({ flag, select_lang }) => {
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
    <Navbar dark expand className="navbar-landing d-none d-lg-block p-4">
      <Container>
        <Nav className="ml-auto mr-auto" navbar>
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

const Intro = ({ sign_in }) => {
  const { t } = useTranslation();
  const [signin_email, setSignin_email] = useState('');
  const [signin_pass, setSignin_pass] = useState('');

  const handleEmailChange = (e) => {
    setSignin_email(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setSignin_pass(e.target.value);
  }

  const keyPress = (e) => {
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

  return (
    <section className="landing-intro p-5">
      <Container>
        <Row>
          <Col className="pt-5">
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
                  onKeyDown={keyPress}
                  onChange={handleEmailChange}
                />
                <PasswordInput
                  label={t('Password')}
                  className="w-100 mt-3 mb-3"
                  variant="filled"
                  id="login_password"
                  name="login_password"
                  value={signin_pass}
                  onKeyDown={keyPress}
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
                  <a className="Create-New-Account" href="/sign-up">{t('CreateNewAccount')}?</a>
                </div>
              </CardBody>
            </Card>
            <Row className="mt-5">
              <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5 text-right">
                <Button className="app-store" href="https://apps.apple.com/us/app/bigdata666/id1497469745" target="blank" />
              </Col>
              <Col xl="6" lg="6" md="6" sm="6" xs="6" className="p-5">
                <Button className="google-play" href="https://play.google.com/store/apps/details?id=com.react_native_roulette" target="blank" />
              </Col>
            </Row>
          </Col>
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
      title: "Login result",
      message: "Hello!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      loading: false,
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
            if (res.data.userinfo.default_dashboard == 1) {
              window.location.href = '/roulette';
            } else if (res.data.userinfo.default_dashboard == 2) {
              window.location.href = '/blackjack';
            } else {
              window.location.href = '/default-setting';
            }
          }, 3000);
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

  render() {
    return (
      <React.Fragment>
        {
          !this.state.loading ? (
            <Row noGutters>
              <Col xl="7" lg="7" className="d-none d-lg-block">
                <div className="landing-bg">
                  <div>
                    <img src={logo} alt={'logo'} width={'200'} className="thumbnail p-3 pl-5" />
                  </div>
                  <div className="sign-text">
                    <Container>
                      <Row>
                        <Col xl={{ size: 9, offset: 3 }} lg={{ size: 9, offset: 3 }} className="text-center">
                          <span className="A-professional-roule"><Translation>{(t, { i18n }) => <>{t('BringData')}</>}</Translation></span>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>
              </Col>
              <Col xl="5" lg="5" className="text-center">
                <Navigation flag={this.state.flag} select_lang={this.select_lang} />
                <Navigation1 flag={this.state.flag} select_lang={this.select_lang} />
                <Intro sign_in={this.sign_in} />
              </Col>
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
            </Row>
          ) : (
            <div className="ballbeat text-center">
              <BallBeat
                color={'#000'}
                loading={this.state.loading}
              />
            </div>
          )
        }
      </React.Fragment>
    );
  }
}

export default Landing;
