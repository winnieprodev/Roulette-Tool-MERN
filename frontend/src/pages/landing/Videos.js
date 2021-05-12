import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
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
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { toastr } from "react-redux-toastr";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { XCircle, MoreVertical, Plus } from "react-feather";
import Unlike from "../../assets/img/UnLike.png";
import Like from "../../assets/img/Like.png";
import logo from "../../assets/img/Icon666.png";
import usFlag from "../../assets/img/flags/us.png";
import cnFlag from "../../assets/img/flags/cn.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import esFlag from "../../assets/img/flags/es.png";
import * as PageService from "../../action/page";
import * as UserService from '../../action/user';
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
      videos: [],
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
      flag: usFlag,
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

    let self = this;

    PageService.get_videos({active: 1}).then(function(res) {
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
            let arrayTwitch = videos[index]['embed_url'].split('=www.example.com');
            if (arrayTwitch.length > 1) {
              arrayTwitch[0] = arrayTwitch[0] + '=' + Domain;
            }
            stack['url'] = arrayTwitch[0];
            stack['tags'] = videos[index]['tags'] ? videos[index]['tags'].split(",") : [];
            stack['hashTags'] = videos[index]['tags'] ? '#' + videos[index]['tags'].replaceAll(',', ', #') : '#tutorial';
            stack['likes'] = videos[index]['likes'] ? JSON.parse(videos[index]['likes']) : [];
            stack['category'] = videos[index]['category'] ? videos[index]['category'] : 0;
            stack['created_at'] = videos[index].created_at;
            stack['date'] = diff;
            video_group.push(stack);
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

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
      type: ''
    })
  }
  
  removeSearchTag = (i) => {
    const newTags = [ ...this.state.searchTags ];
    newTags.splice(i, 1);
    this.setState({ searchTags: newTags, type: '' });
  }

  inputSearchKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (this.state.searchTags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.setState({ searchTags: [...this.state.searchTags, val], searchTagInput: '', type: ''});
    }
  }

  none() {
    console.log('Disable go to url.');
  }

  onSearchVideo = () => {
    let searchTags = this.state.searchTags;
    searchTags = searchTags.filter(video => {
      video = video.toLowerCase();
      return video;
    })
    let category = this.state.searchCategorySelect;
    let videos = this.state.videos;
    let tempVideos = [];
    videos = videos.filter(video => {
      if (category == 0) {
        let tags = video.tags ? video.tags : [];
        var filteredArray = tags.filter(function(n) {
          return searchTags.indexOf(n.toLowerCase()) !== -1;
        });
        if (filteredArray.length > 0) {
          tempVideos.push(video);
        }
      } else {
        if (video.category == category) {
          let tags = video.tags ? video.tags : [];
          var filteredArray = tags.filter(function(n) {
            return searchTags.indexOf(n.toLowerCase()) !== -1;
          });
          if (filteredArray.length > 0) {
            tempVideos.splice(0, 0, video);
          } else {
            tempVideos.push(video);
          }
        }
      }
      return video;
    })
    this.setState({
      searchResult: true,
      searchVideos: tempVideos,
      searchTags: [],
      type: ''
    })
  }

  onRemoveSearchResult = () => {
    this.setState({
      searchResult: false,
      type: ''
    })
  }
  
  onHandleChange = (name, value) => {
    this.setState({
      [name]: value,
      type: ''
    })
    let sort_key = value;
    let videos = this.state.videos;
    let tempVideosA = [];
    let tempVideosB = [];
    if (sort_key == 'desc') {
      videos.sort(function compare(b, a) {
        var dateA = new Date(a.created_at);
        var dateB = new Date(b.created_at);
        return dateA - dateB;
      });
    } else if (sort_key == 'asc') {
      videos.sort(function compare(a, b) {
        var dateA = new Date(a.created_at);
        var dateB = new Date(b.created_at);
        return dateA - dateB;
      });
    } else if (sort_key == 'likes') {
      videos.sort(function compare(b, a) {
        var dateA = a.likes ? a.likes : [];
        var dateB = b.likes ? b.likes : [];
        return dateA.length - dateB.length;
      });
    } else {
      if (sort_key == 'roulette') {
        videos = videos.filter(video => {
          if (video.category == 1) {
            tempVideosA.push(video);
          } else {
            tempVideosB.push(video);
          }
          return video;
        })
      } else if (sort_key == 'blackjack') {
        videos = videos.filter(video => {
          if (video.category == 2) {
            tempVideosA.push(video);
          } else {
            tempVideosB.push(video);
          }
          return video;
        })
      } else if (sort_key == 'bacarrat') {
        videos = videos.filter(video => {
          if (video.category == 3) {
            tempVideosA.push(video);
          } else {
            tempVideosB.push(video);
          }
          return video;
        })
      } else if (sort_key == 'roulette_robot') {
        videos = videos.filter(video => {
          if (video.category == 4) {
            tempVideosA.push(video);
          } else {
            tempVideosB.push(video);
          }
          return video;
        })
      } else if (sort_key == 'tutorial') {
        videos = videos.filter(video => {
          if (video.category == 5) {
            tempVideosA.push(video);
          } else {
            tempVideosB.push(video);
          }
          return video;
        })
      }
      tempVideosA.sort(function compare(b, a) {
        var dateA = new Date(a.created_at);
        var dateB = new Date(b.created_at);
        return dateA - dateB;
      });
      tempVideosB.sort(function compare(b, a) {
        var dateA = new Date(a.created_at);
        var dateB = new Date(b.created_at);
        return dateA - dateB;
      });
      videos = tempVideosA.concat(tempVideosB);
    }
    this.setState({
      videos: videos,
      type: ''
    })
  }

  onCopiedURL = () => {
    this.setState({type: "success", message: "Copied URL!"});
    this.showToastr();
  }

  render()
  {
    let { videos } = this.state;
    let currentUrl = 'https://' + Domain + '/blogs/';
    let encodedURL = encodeURI('https://' + Domain + '/blogs/');
    let currentTitle = 'BigData666 for gamers';
    let encodedText = encodeURI('BigData666 for gamers');
    return(
      <React.Fragment>
        <Navigation flag={this.state.flag} select_lang={this.select_lang}  />
        <section className="landing-intro1 p-5">
          <Container fluid className="p-0">
            
            <Row className="m-0 pt-3">
              <Col className="d-flex mt-2">
                <div className="ml-auto">
                  {/* <span style={{color: '#fff', fontSize: '20px'}}>Sort by:</span> */}
                  <CustomInput
                    type="select"
                    id="exampleCustomSelect"
                    name="customSelect"
                    // className="ml-3 mr-3"
                    style={{width: '250px', height: '50px', borderRadius: '8px'}}
                    onChange={(e) => this.onHandleChange('sortSelect', e.target.value)}
                  >
                    <Translation>{(t, { i18n }) => <option value="desc">{t('NewToOld')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="asc">{t('OldToNew')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="likes">{t('MostLikes')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="roulette">{t('Roulette')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="blackjack">{t('BlackJack')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="bacarrat">{t('Baccarat')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="roulette_robot">{t('RouletteRobot')}</option>}</Translation>
                    <Translation>{(t, { i18n }) => <option value="tutorial">{t('Tutorial')}</option>}</Translation>
                  </CustomInput>
                </div>
              </Col>
            </Row>
            <Row className="m-0 mt-3" >
            {
              Object.keys(videos).map((rowData, index) => {
                return (
                  <Col xl="4" lg="4" md="6" sm="6" className="w-100" key={index}>
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
                                  url={currentUrl + videos[rowData].id}
                                  quote={currentTitle}
                                  hashtag={videos[rowData].hashTags}
                                  style={{width: '100%', textAlign: 'left'}}
                                >
                                  Facebook
                                </FacebookShareButton>
                              </DropdownItem>
                              <DropdownItem>
                                <TwitterShareButton
                                  url={currentUrl + videos[rowData].id}
                                  title={currentTitle}
                                  hashtags={videos[rowData].tags}
                                  style={{width: '100%', textAlign: 'left'}}
                                >
                                  Twitter
                                </TwitterShareButton>
                              </DropdownItem>
                              <DropdownItem>
                                <CopyToClipboard text={currentUrl + videos[rowData].id} onCopy={() => this.onCopiedURL()}><span><Translation>{(t, { i18n }) => <option value="0">{t('CopyLink')}</option>}</Translation></span></CopyToClipboard>
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
                      <div className="video-wrp">
                        <Link to={'/blogs/' + videos[rowData].id}><div style={{zIndex: 3, position: 'absolute', width: '100%', height: '100%'}}></div></Link>
                        <iframe className="embedIframe" src={videos[rowData].url} frameBorder="0" allowFullScreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>
                      </div>
                      <CardBody>
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