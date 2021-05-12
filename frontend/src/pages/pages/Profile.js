import React, { Component } from "react";
import { useTranslation, Translation } from 'react-i18next';
import { toastr } from "react-redux-toastr";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  CustomInput,
} from "reactstrap";
import Wizard from "./Wizard";
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import superuserBadge from "../../assets/img/gold.png";
import * as UserService from '../../action/user';
import config from '../../config';

const APIUrl = config.server.APIUrl;

class Profile extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      title: "Profile Update",
      message: "Have fun storming the castle!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      username: '',
      email: '',
      phone: '',
      avatar: '',
      defaultDashboard: 1,
      isSuperuser: 0,
      approvedContext: ''
    };
  }

  async componentDidMount() {
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    this.setState({
      username: userinfo['username'],
      email: userinfo['email'],
      phone: userinfo['phone'],
      avatar: APIUrl + userinfo['avatar'],
      defaultDashboard: userinfo['default_dashboard'],
      isSuperuser: userinfo['super_user']
    })

    try {
      const res = await UserService.get_settings({context: 'Notification'});
      if (res.data.settings.data) {
        let data = JSON.parse(res.data.settings.data);
        this.setState({
          approvedContext: data.resultContext
        })
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error
      });
    }
  }

  componentDidUpdate() {
    if(this.state.type === 'error') {
      this.showToastr();
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

  keyPress = (e) => {
    if (e.keyCode === 13) {
      this.update_profile();
    }
  }

  handleChange = (name, value) => {
    if (name === 'username') {
      this.setState({
        username: value,
        type: ''
      })
    } else if (name === 'email') {
      this.setState({
        email: value,
        type: ''
      })
    } else if (name === 'phone') {
      this.setState({
        phone: value,
        type: ''
      })
    }
  }

  update_profile = () => {
    let self = this;
    let data = {};
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    data['id'] = userinfo['id'];
    data['username'] = this.state.username;
    data['email'] = this.state.email;
    data['phone'] = this.state.phone;
    
    if (!data['username']) {
      self.setState({
        type: "error",
        message: "Please Insert Your Username!"
      });
      return;
    }

    if (!data['email']) {
      self.setState({
        type: "error",
        message: "Please Insert Your Email!"
      });
      return;
    } else {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(data['email'].toLowerCase())) {
        self.setState({
          type: "error",
          message: "The Email entered is not valid!"
        });
        return;
      }
    }

    if (!data['phone']) {
      self.setState({
        type: "error",
        message: "Please Insert Your Phone Number!"
      });
      return;
    }
    
    UserService.update_profile(data).then(function(res) {
      if (res.data.success) {
        self.setState({
          type: "success",
          message: "The Profile has updated successful!"
        });
        self.showToastr();
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
      } else {
        self.setState({
          type: "error",
          message: res.data.message
        });
      }
    })
  }

  upload = () => {
    $('#avatar').click();
  }

  onChange = e => {
    let self = this;
    if (e.target.files.length) {
      const formData = new FormData();
      const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (types.every(type => e.target.files[0].type !== type)) {
        this.setState({
          type: "error",
          message: "Please Select Image File!"
        });
        return;
      }

      if (e.target.files[0].size > 1000000) {
        this.setState({
          type: "error",
          message: "'"+ e.target.files[0].name + "' is too large, please pick a smaller file"
        });
        return;
      }
      formData.append("fileImg", e.target.files[0]);

      UserService.user_image(formData).then(function(res) {
        if (res.data.success) {
          let data = {};
          let userinfo = window.localStorage.getItem('userinfo');
          userinfo = JSON.parse(userinfo);
          data['id'] = userinfo['id'];
          data['avatar'] = res.data.file;

          UserService.upload_avatar(data).then(function(res) {
            self.setState({
              type: "success",
              message: "The Profile avatar has uploaded successful!"
            });
            self.props.save_avatar(APIUrl + data['avatar']);
            self.showToastr();
            window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
          })
        } else {
          self.setState({
            type: "error",
            message: "Server Error"
          });
        }
      })
    }
    
  }

  onChangeDashboard = (e) => {
    this.setState({
      defaultDashboard: parseInt(e.target.value, 10)
    })
    let self = this;
    let send_data = {};
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    send_data['id'] = userinfo['id'];
    send_data['default_dashboard'] = parseInt(e.target.value, 10);
    UserService.update_profile(send_data).then(function(res) {
      if (res.data.success) {
        self.setState({
          type: "success",
          message: "Updated successful!"
        });
        self.showToastr();
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
      } else {
        console.log('fail');
      }
    })
  }

  render()
  {
    let { defaultDashboard, isSuperuser, approvedContext } = this.state;
    return(
      <Container fluid className="p-3">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <Translation>{(t, { i18n }) => <>{t('Profile')}</>}</Translation>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="8">
                    <FormGroup>
                      <Label for="inputUsername"><Translation>{(t, { i18n }) => <>{t('Username')}</>}</Translation></Label>
                      <Translation>{(t, { i18n }) => 
                        <>
                          <Input type="text" name="username" id="inputUsername" value={this.state.username} placeholder={t('Username')} onChange={(e) => {this.handleChange("username", e.target.value)}} onKeyDown={this.keyPress} disabled />
                        </>}
                      </Translation>
                    </FormGroup>
                    <FormGroup>
                      <Label for="inputEmail"><Translation>{(t, { i18n }) => <>{t('Email')}</>}</Translation></Label>
                      <Translation>{(t, { i18n }) => 
                        <>
                          <Input type="email" name="email" id="inputEmail" value={this.state.email} placeholder={t('Email')} onChange={(e) => {this.handleChange("email", e.target.value)}} onKeyDown={this.keyPress} disabled />
                        </>}
                      </Translation>
                    </FormGroup>
                    <FormGroup>
                      <Label for="inputPhone"><Translation>{(t, { i18n }) => <>{t('Phone')}</>}</Translation></Label>
                      <Translation>{(t, { i18n }) => 
                        <>
                          <Input type="text" name="phone" id="inputPhone" value={this.state.phone} placeholder={t('Phone')} onChange={(e) => {this.handleChange("phone", e.target.value)}} onKeyDown={this.keyPress} />
                        </>}
                      </Translation>
                    </FormGroup>
                    <Button color="primary" onClick={this.update_profile}><Translation>{(t, { i18n }) => <>{t('SaveChanges')}</>}</Translation></Button>
                    <Row>
                      <Col>
                        <CustomInput  
                          type="select"
                          id="exampleCustomSelect"
                          name="customSelect"
                          className="mt-3"
                          style={{width: '100%'}}
                          onChange={this.onChangeDashboard}
                          value={defaultDashboard}
                        >
                          <Translation>{(t, { i18n }) => <option value="1">{t('RouletteDefaultPage')}</option>}</Translation>
                          <Translation>{(t, { i18n }) => <option value="2">{t('BlackJackDefaultPage')}</option>}</Translation>
                          <Translation>{(t, { i18n }) => <option value="3">{t('BacaratDefaultPage')}</option>}</Translation>
                        </CustomInput>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="4">
                    <div className="text-center">
                      <img
                        alt="Your Avatar"
                        src={this.props.avatar}
                        className="rounded-circle img-responsive mt-2"
                        width="128"
                        height="128"
                      />
                      <div className="mt-2">
                        <input type="file" id="avatar" onChange={this.onChange} />
                        <Button color="primary" onClick={this.upload}>
                          <FontAwesomeIcon icon={faUpload} /> <Translation>{(t, { i18n }) => <>{t('Upload')}</>}</Translation>
                        </Button>
                        
                      </div>
                      <small>
                        <Translation>{(t, { i18n }) => <>{t('FormatComment')}</>}</Translation>
                      </small>
                      {
                        isSuperuser > 1 && (
                          <div className="mt-3">
                            <img
                              src={superuserBadge}
                              className="img-responsive mt-2"
                              width="60"
                              height="60"
                            />
                            <p style={{color: '#FBA500', fontSize: '12px', marginTop: '10px', fontWeight: 'bold'}}><Translation>{(t, { i18n }) => <>{t('SuperuserBadge')}</>}</Translation></p>
                          </div>
                        )
                      }
                      
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <Wizard className="p-2" isSuperuser={isSuperuser} approvedContext={approvedContext} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Profile;
