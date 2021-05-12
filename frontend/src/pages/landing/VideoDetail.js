import React, { Component } from "react";
import { useTranslation, Translation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { toastr } from "react-redux-toastr";
import { Helmet } from "react-helmet";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { XCircle, MoreVertical, Plus } from "react-feather";
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import esFlag from "../../assets/img/flags/es.png";
import Unlike from "../../assets/img/UnLike.png";
import Like from "../../assets/img/Like.png";
import * as PageService from "../../action/page";
import config from '../../config';

const APIUrl = config.server.APIUrl;
const Domain = config.server.Domain;
        
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
              <span className="How-it-works-Pricing">{t('Pricing')}</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/blogs" active>
              <span className="How-it-works-Pricing active">{t('Videos')}</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  )
}

class Videos extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      flag: usFlag,
      videos: [],
      embedCode: '',
      tags: [],
      tagInput: '',
      categorySelect: '',
      searchTags: [],
      searchTagInput: '',
      searchCategorySelect: 0,
      searchVideos: [],
      searchResult: false,
      addVideo: false,
      is_uploadRole: false,
      sortSelect: 'desc',
      title: "Embed Video",
      message: "Copied URL!",
      type: "success",
      timeOut: 3000,
      showCloseButton: false,
      progressBar: true,
      position: "top-right",
      show_notification: true,
      bar_message: '',
      enable_bar_click: false,
      on_click_go_to: '',
      open_in_a_new_tab: false,
      show_button: false,
      button_text: '',
      button_color: '#000000',
      button_text_color: '#FFFFFF',
      show_discount_code: false,
      discount_code: '',
      text_color: '#FFFFFF',
      coupon_code_color: '#FFFFFF',
      background_left_color: '#000000',
      background_right_color: '#FFFFFF',
      show_shadow: false,
      notification_style: {backgroundImage: 'linear-gradient(to right, , )'},
      message_style: {color: ''},
      discount_btn_style: {border: '1px #FFFFFF dashed', backgroundColor: 'transparent', color: ''},
      button_style: {backgroundColor: '', color: '', borderColor: ''},
      close_style: {color: '', cursor: 'pointer'},
      isDelModal: false,
      notification_time: '',
      embededtitle: '',
      description: '',
      thumnbnail: '',
      currentUrl: '',
      hashtag: ''
    }
  }

  componentWillUnmount() {}
  componentWillMount() {}
  componentDidUpdate() {
    if (this.state.type === 'error') {
      this.showToastr();
    }
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
    let route = this.props.match.params.id;
    let self = this;

    PageService.get_video({id: route}).then(function(res) {
      if (res.data.success) {
        // console.log('success');

        let videos = res.data.videos;
        console.log(videos)
        let video_group = [];
        
        if (videos.length) {
          for (var index = 0; index < videos.length; index++) {
            let created_at = new Date(videos[index].created_at);
            let now_date = new Date();
            const diffInMs = Math.abs(now_date - created_at);
            // mins
            let diff = Math.ceil(diffInMs / (1000 * 60));
            if (diff > 59) {
              // hours
              diff = Math.ceil(diffInMs / (1000 * 60 * 60));
              if (diff > 23) {
                // days
                diff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                if (diff > 30) {
                  // months
                  diff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 30));
                  if (diff > 11) {
                    // years
                    diff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 365));
                    diff = diff + ' years ago';
                  } else {
                    diff = diff + ' months ago';
                  }
                } else {
                  diff = diff + ' days ago';
                }
              } else {
                diff = diff + ' hours ago';
              }
            } else {
              diff = diff + ' minutes ago';
            }

            let stack = {};
            stack['id'] = videos[index]['id'];
            stack['user_id'] = videos[index]['user_id'];
            stack['username'] = videos[index]['username'];
            stack['avatar'] = APIUrl + videos[index]['avatar'];
            stack['title'] = videos[index]['title'];
            stack['description'] = videos[index]['description'];
            let arrayTwitch = videos[index]['embed_url'].split('=www.example.com');
            if (arrayTwitch.length > 1) {
              arrayTwitch[0] = arrayTwitch[0] + '=' + Domain;
            }
            stack['url'] = arrayTwitch[0];
            stack['tags'] = videos[index]['tags'] ? videos[index]['tags'].split(",") : [];
            stack['likes'] = videos[index]['likes'] ? JSON.parse(videos[index]['likes']) : [];
            stack['category'] = videos[index]['category'] ? videos[index]['category'] : 0;
            stack['created_at'] = videos[index].created_at;
            stack['date'] = diff;
            video_group.push(stack);
            self.setState({
              embededtitle: videos[index]['title'],
              description: videos[index]['description'],
              thumnbnail: APIUrl + videos[index]['thumbnail_url'],
              currentUrl: 'https://' + Domain + '/blogs/' + route,
              hashtag: videos[index]['tags'] ? '#' + videos[index]['tags'].replaceAll(',', ', #') : '#tutorial'
            })
          }
          self.setState({
            videos: video_group
          })
        } else {
          self.setState({
            videos: video_group
          })
        }
      } else {
        console.log('fail');
      }
    })
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

  none() {
    console.log('Disable go to url.');
  }

  onCopiedURL = () => {
    this.setState({type: "success", message: "Copied URL!"});
    this.showToastr();
  }

  render()
  {
    let { videos, embededtitle, description, thumnbnail, currentUrl, hashtag } = this.state;
    let encodedURL = encodeURI(currentUrl);
    let encodedText = encodeURI('BigData666 for gamers');
    return(
      <React.Fragment>
        <Helmet>
          <title>{embededtitle}</title>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="csrf_token" content="" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <meta name="_token" content="" />
          <meta name="robots" content="noodp" />
          <meta name="description" content={description} />
          <meta content="image/*" property="og:image:type" />
          <meta property="type" content="website" />
          <meta property="url" content={currentUrl} />
          <meta property="title" content={embededtitle} />
          <meta property="quote" content={'BigData666 for gamers'} />
          <meta property="og:site_name" content="Bigdata666" />
          <meta property="og:title" content={embededtitle} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={thumnbnail} />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="300" />
          <meta property="og:quote" content={'BigData666 for gamers'} />
          <meta property="og:hashtag" content={hashtag} />
          <meta property="og:locale" content="en_US" />
          <meta itemprop="name" content={embededtitle} />
          <meta itemprop="url" content={currentUrl} />
          <meta itemprop="description" content={description} />
          <meta itemprop="thumbnailUrl" content={thumnbnail} />
          <meta itemprop="image" content={thumnbnail} />
          <meta name="twitter:title" content={embededtitle} />
          <meta name="twitter:image" content={thumnbnail} />
          <meta name="twitter:url" content={currentUrl} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:description" content={description} />
          <meta name="description" content={description} />
          <link rel="image_src" href={thumnbnail} />
        </Helmet>
        <Navigation flag={this.state.flag} select_lang={this.select_lang}  />
        <section className="landing-intro1 p-2">
          <Container fluid className="p-1">
            <Row className="m-0 mt-5" >
            {
              Object.keys(videos).map((rowData, index) => {
                return (
                  <Col xl="12" lg="12" md="12" sm="12" className="w-100" key={index}>
                    <Card className="flex-fill w-100">
                      <CardHeader>
                        <div className="card-actions float-right">
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a">
                              <MoreVertical />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem>
                                <FacebookShareButton
                                  url={currentUrl}
                                  quote={'BigData666 for gamers'}
                                  hashtag={hashtag}
                                  style={{width: '100%', textAlign: 'left'}}
                                >
                                  Facebook
                                </FacebookShareButton></DropdownItem>
                              <DropdownItem>
                                <TwitterShareButton
                                  url={currentUrl}
                                  title={'BigData666 for gamers'}
                                  hashtags={videos[rowData].tags}
                                  style={{width: '100%', textAlign: 'left'}}
                                >
                                  Twitter
                                </TwitterShareButton>
                              </DropdownItem>
                              <DropdownItem>
                                <CopyToClipboard text={currentUrl} onCopy={() => this.onCopiedURL()}><span><Translation>{(t, { i18n }) => <option value="0">{t('CopyLink')}</option>}</Translation></span></CopyToClipboard>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <div style={{display: 'flex'}}>
                          <img
                            src={videos[rowData].avatar}
                            className="avatar img-fluid rounded-circle mr-1 mt-0 mb-0"
                            alt="User Avatar"
                          />
                          <div>
                            <p className="align-middle mb-0"> {videos[rowData].username} </p>
                            <p className="align-middle mb-0"> {videos[rowData].date} </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Row className="m-0">
                          <Col xl="6" lg="6" md="6">
                            <div className="video-wrp">
                              <iframe className="embedIframe" src={videos[rowData].url} frameBorder="0" allowFullScreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>
                            </div>
                          </Col>
                          <Col xl="6" lg="6" md="6">
                            <h3>{videos[rowData].title}</h3>
                            <p>{videos[rowData].description}</p>
                            <Row className="m-0">
                              <Col className="tags-group p-0" xl="10" lg="9" md="9">
                                <ul className="input-tag__tags">
                                { videos[rowData].tags.map((tag, i) => (
                                  <li key={tag}>
                                    {tag}
                                  </li>
                                ))}
                                </ul>
                              </Col>
                              <Col className="likes-group p-0 text-center d-flex" xl="2" lg="3" md="3">
                                <div className="align-middle m-auto">
                                  {
                                    videos[rowData].likes.length > 0 ? (
                                      <>
                                        <img className="cursor-pointer" src={Like} alt={'like'} />
                                        <p className="m-0 likes-title">{videos[rowData].likes.length} Likes</p>
                                      </>
                                    ) : (
                                      <>
                                        <img className="cursor-pointer" src={Unlike} alt={'unlike'} />
                                        <p className="m-0 likes-title">{videos[rowData].likes.length} Likes</p>
                                      </>
                                    )
                                  }
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                )
              })
            }
            </Row>
          </Container>
        </section>
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
    )
  }
}

export default Videos;