import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import { Badge, Button } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import routes from "../routes/index";
import logo from "../assets/img/Icon666.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dashboard_Icon from "../assets/img/Icon.svg";
import BlackJack_Icon from "../assets/img/BlackJack_nav_icon.png";
import Bacarrat_Icon from "../assets/img/Bacarrat_icon.png";
import { useTranslation, Translation } from 'react-i18next';
import $ from 'jquery';

const SidebarItem = withRouter(
  ({ name, badgeColor, badgeText, icon: Icon, ficon: fIcon, svgimg: SVG, pngimg: PNG, bacaimg: BACA, location, to }) => {
    const { t } = useTranslation();
    const getSidebarItemClass = path => {
      return location.pathname === path ? "active" : "";
    };

    return (
      <li className={"sidebar-item " + getSidebarItemClass(to)}>
        {
          to == '/tutorial' ? (
            <a href="https://bigdata666.net" target="_blank" className="sidebar-link" activeclassname="active">
              {Icon ? <Icon size={18} className="align-middle mr-3" /> : null}
              {fIcon ? <FontAwesomeIcon className="align-middle mr-3" icon={fIcon} fixedWidth /> : null}
              {SVG ? <img alt="dashboard roulette icon" src={Dashboard_Icon} className="align-middle mr-3" width="20" /> : null}
              {PNG ? <img alt="dashboard blackjack icon" src={BlackJack_Icon} className="align-middle mr-3" width="20" /> : null}
              {BACA ? <img alt="dashboard bacarrat icon" src={Bacarrat_Icon} className="align-middle mr-3" width="20" /> : null}
              {t(name)}{name=='Videos' ? ' 🔥' : ''}
              {badgeColor && badgeText ? (
                <Badge color={badgeColor} size={18} className="sidebar-badge">
                  {badgeText}
                </Badge>
              ) : null}
            </a>
          ) : (
            <NavLink to={to} className="sidebar-link" activeClassName="active">
              {Icon ? <Icon size={18} className="align-middle mr-3" /> : null}
              {fIcon ? <FontAwesomeIcon className="align-middle mr-3" icon={fIcon} fixedWidth /> : null}
              {SVG ? <img alt="dashboard roulette icon" src={Dashboard_Icon} className="align-middle mr-3" width="20" /> : null}
              {PNG ? <img alt="dashboard blackjack icon" src={BlackJack_Icon} className="align-middle mr-3" width="20" /> : null}
              {BACA ? <img alt="dashboard bacarrat icon" src={Bacarrat_Icon} className="align-middle mr-3" width="20" /> : null}
              {t(name)}{name=='Videos' ? ' 🔥' : ''}
              {badgeColor && badgeText ? (
                <Badge color={badgeColor} size={18} className="sidebar-badge">
                  {badgeText}
                </Badge>
              ) : null}
            </NavLink>
          )
        }
      </li>
    );
  }
);

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showChartStatus: false,
    };
  }

  toggle = index => {
    // Collapse all elements
    Object.keys(this.state).forEach(
      item =>
        this.state[index] ||
        this.setState(() => ({
          [item]: false
        }))
    );

    // Toggle selected element
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

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

  showChart = () => {
    let showChartStatus = this.state.showChartStatus;
    if (!showChartStatus) {
      $('.fetch-table').show();
    } else {
      $('.fetch-table').hide();
    }
    this.setState({
      showChartStatus: !showChartStatus
    })
  }

  render() {
    const { sidebar, layout } = this.props;
    const pathName = this.props.location.pathname;

    return (
      <nav
        className={
          "sidebar" +
          (!sidebar.isOpen ? " toggled" : "") +
          (!sidebar.isSticky ? " sidebar-sticky" : "")
        }
      >
        <div className="sidebar-content">
          <PerfectScrollbar>
            <a className="sidebar-brand" href="/">
              <img src={logo} alt={'logo'} width={'100%'} className="thumbnail" />
            </a>

            <ul className="sidebar-nav">
              {routes.map((category, index) => {
                if (category.name == 'RouletteDashboard' || category.name == 'BlackJackDashboard' || category.name == 'BaccaratDashboard' || category.name == 'RouletteGameHistory' || category.name == 'Videos' || category.name == 'Pricing') {
                  return (
                    <React.Fragment key={index}>
                      <SidebarItem
                        name={category.name}
                        to={category.path}
                        icon={category.icon}
                        ficon={category.ficon}
                        svgimg={category.svg}
                        pngimg={category.img}
                        bacaimg={category.baca}
                        badgeColor={category.badgeColor}
                        badgeText={category.badgeText}
                      />
                    </React.Fragment>
                  );
                }
              })}
            </ul>
            {!layout.isBoxed && !sidebar.isSticky && pathName != '/blackjack' ? (
              <div className="sidebar-bottom" style={{backgroundColor: '#091F36'}}>
                <ul className="sidebar-nav">
                  {routes.map((category, index) => {
                    if (category.name == 'ContactUs' || category.name == 'Settings') {
                      return (
                        <React.Fragment key={index}>
                          <SidebarItem
                            name={category.name}
                            to={category.path}
                            icon={category.icon}
                            ficon={category.ficon}
                            svgimg={category.svg}
                            pngimg={category.img}
                            bacaimg={category.baca}
                            badgeColor={category.badgeColor}
                            badgeText={category.badgeText}
                          />
                        </React.Fragment>
                      );
                    }
                  })}
                </ul>
                <p className="Version-10"><Translation>{(t, { i18n }) => <>{t('Version')}</>}</Translation> 2.0</p>
                <p className="Version-10">BigData666.com © {new Date().getFullYear()}</p>
              </div>
            ) : null}
            {!layout.isBoxed && !sidebar.isSticky && pathName == '/blackjack' ? (
              <div className="sidebar-bottom" style={{backgroundColor: '#091F36'}}>
                <ul className="sidebar-nav">
                  {routes.map((category, index) => {
                    if (category.name == 'ContactUs' || category.name == 'Settings') {
                      return (
                        <React.Fragment key={index}>
                          <SidebarItem
                            name={category.name}
                            to={category.path}
                            icon={category.icon}
                            ficon={category.ficon}
                            svgimg={category.svg}
                            pngimg={category.img}
                            bacaimg={category.baca}
                            badgeColor={category.badgeColor}
                            badgeText={category.badgeText}
                          />
                        </React.Fragment>
                      );
                    }
                  })}
                </ul>
                <div className="text-center">
                  <Button className="Version-10 show_chart" onClick={this.showChart}>{!this.state.showChartStatus ? (<Translation>{(t, { i18n }) => <>{t('ShowChart')}</>}</Translation>) : (<Translation>{(t, { i18n }) => <>{t('HideChart')}</>}</Translation>)}</Button>
                </div>
                <p className="Version-10"><Translation>{(t, { i18n }) => <>{t('Version')}</>}</Translation> 2.0</p>
                <p className="Version-10">BigData666.com © {new Date().getFullYear()}</p>
              </div>
            ) : null}
          </PerfectScrollbar>
        </div>
      </nav>
    );
  }
}

export default withRouter(
  connect(store => ({
    sidebar: store.sidebar,
    layout: store.layout
  }))(Sidebar)
);
