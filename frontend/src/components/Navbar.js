import React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";

import {
  Collapse,
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import {
  User
} from "react-feather";

import usFlag from "../assets/img/flags/us.png";
import cnFlag from "../assets/img/flags/cn.png";
import frFlag from "../assets/img/flags/fr.png";
import deFlag from "../assets/img/flags/de.png";
import esFlag from "../assets/img/flags/es.png";

import { useTranslation } from 'react-i18next';

import { Auth } from 'aws-amplify';


const NavbarComponent = ({ dispatch, avatar, lang, select_lang}) => {

  const { t, i18n } = useTranslation()

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
  
  const signout = async(event) => {
    event.preventDefault();
    try {
      Auth.signOut();
      window.localStorage.removeItem('userinfo');
      window.localStorage.removeItem('page_row');
      window.localStorage.removeItem('game_row');
      window.localStorage.removeItem('bacaGame_row');
      window.localStorage.removeItem('range_group');
      window.location.href = '/';
    } catch(error) {
      console.log(error.message)
    }
  }

  return (
    <Navbar color="white" light expand>
      <span
        className="sidebar-toggle d-flex mr-2"
        onClick={() => {
          dispatch(toggleSidebar());
        }}
      >
        <i className="hamburger align-self-center" />
      </span>

      <Collapse navbar>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar className="mr-2">
            <DropdownToggle nav caret className="nav-flag">
              <img src={lang} alt="flag" />
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

          <UncontrolledDropdown nav inNavbar>
            <span className="d-inline-block d-sm-none">
              <DropdownToggle nav caret>
                <User size={18} className="align-middle" />
              </DropdownToggle>
            </span>
            <span className="d-none d-sm-inline-block">
              <DropdownToggle nav>
                <img
                  src={avatar}
                  className="avatar img-fluid rounded-circle mr-1"
                  alt="User Avatar"
                />
              </DropdownToggle>
            </span>
            <DropdownMenu right>
              <DropdownItem onClick={signout}>{t('Logout')}</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default connect(store => ({
  app: store.app
}))(NavbarComponent);
