import React from "react";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import usFlag from "../assets/img/flags/us.png";
import cnFlag from "../assets/img/flags/cn.png";
import frFlag from "../assets/img/flags/fr.png";
import deFlag from "../assets/img/flags/de.png";
import esFlag from "../assets/img/flags/es.png";
import i18n from '../i18n';
import config from '../config';
import * as UserService from '../action/user';
import $ from 'jquery';

const APIUrl = config.server.APIUrl;

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      avatar: '',
      lang: usFlag
    }
  }

  async componentDidMount() {

    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    let avatar = userinfo['avatar'];
    this.setState({
      avatar: APIUrl + avatar,
    })
    
    let lang = window.localStorage.getItem('i18nextLng');
    if (!lang) {
      i18n.changeLanguage('en');
      this.setState({
        lang: usFlag
      })
    } else {
      if (lang === 'en-US' || lang === 'en') {
        i18n.changeLanguage('en');
        this.setState({
          lang: usFlag
        })
      } else if (lang === 'cn') {
        i18n.changeLanguage('cn');
        this.setState({
          lang: cnFlag
        })
      } else if (lang === 'fr') {
        i18n.changeLanguage('fr');
        this.setState({
          lang: frFlag
        })
      } else if (lang === 'de') {
        i18n.changeLanguage('de');
        this.setState({
          lang: deFlag
        })
      } else if (lang === 'es') {
        i18n.changeLanguage('es');
        this.setState({
          lang: esFlag
        })
      }
    }
    try {
      const res = await UserService.get_analytics();
      let analytics = res.data.analysis;
      for(var index = 0; index < analytics.length; index++) {
        if (analytics[index].status === 1) {
          if (analytics[index].analytic_position === 0) {
            $('head').append(analytics[index].analytic_script);
          } else if (analytics[index].analytic_position === 1) {
            $(analytics[index].analytic_script).insertBefore('#root');
          } else if (analytics[index].analytic_position === 2) {
            $('body').append(analytics[index].analytic_script);
          }
        }
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error,
        isToolModal: false
      });
    }
  }

  save_avatar = (avatar) => {
    this.setState({
      avatar: avatar
    })
  }

  select_lang = (lang) => {
    if (lang === 'en') {
      this.setState({
        lang: usFlag
      })
    } else if (lang === 'cn') {
      this.setState({
        lang: cnFlag
      })
    } else if (lang === 'fr') {
      this.setState({
        lang: frFlag
      })
    } else if (lang === 'de') {
      this.setState({
        lang: deFlag
      })
    } else if (lang === 'es') {
      this.setState({
        lang: esFlag
      })
    }
  }
  render()
  {
    return (
      <React.Fragment>
        <Wrapper>
          <Sidebar />
          <Main>
            <Navbar avatar={this.state.avatar} lang={this.state.lang} select_lang={this.select_lang} />
            <Content save_avatar={this.save_avatar} avatar={this.state.avatar} >{this.props.children}</Content>
          </Main>
        </Wrapper>
      </React.Fragment>
    )
  }
}

export default Dashboard;
