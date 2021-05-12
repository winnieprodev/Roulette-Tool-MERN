import React, { Component } from "react";
import { useTranslation, Translation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalBody,
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
import Unlike from "../../assets/img/UnLike.png";
import Like from "../../assets/img/Like.png";
import * as PageService from "../../action/page";
import config from '../../config';

const APIUrl = config.server.APIUrl;
const Domain = config.server.Domain;

class Videos extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
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
    let route = this.props.match.params.id;
    let self = this;
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    this.setState({
      user_id: userinfo['id'],
      is_uploadRole: userinfo['super_user'] > 1 ? true : false
    })

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
              hashtag: videos[index]['tags'] ? '#' + videos[index]['tags'].replaceAll(',', ',#') : '#tutorial'
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

  delModal = (index) => {
    this.setState({
      del_id: index,
      isDelModal: true,
      type: ''
    })
  }

  onDeleteVideo = async() => {
    let videoID = null;
    let video_index = this.state.del_id;
    let videos = this.state.videos;
    videos = videos.filter((video, index) => {
      if (video_index == index) {
        videoID = video.id;
      }
      return video;
    })
    let send_data = {};
    send_data['id'] = videoID;
    try {
      const res = await PageService.delete_video(send_data);
      if (res.data.success) {
        window.location.href = '/videos';
        videos.splice(video_index, 1);
        this.setState({
          type: "success",
          message: "Successfully Deleted!",
          isDelModal: false,
          videos: videos
        })
        this.showToastr();
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error,
        isDelModal: false
      });
    }
  }

  onLikeVideo = async(id) => {
    let self = this;
    let videos = this.state.videos;
    let videoID = null;
    let likes = null;
    videos = videos.filter((video, index) => {
      if (id == index) {
        video.likes.push(this.state.user_id);
        videoID = video.id;
        likes = video.likes;
      }
      return video;
    })
    let data = {};
    data['id'] = videoID;
    data['likes'] = likes;
    PageService.update_video(data).then(function(res) {
      if (res.data.success) {
        self.setState({
          videos: videos,
          type: '',
        })
      } else {
        console.log('fail');
      }
    })
  }

  onUnLikeVideo = async(id) => {
    let self = this;
    let videos = this.state.videos;
    let videoID = null;
    let likes = null;
    videos = videos.filter((video, index) => {
      if (id == index) {
        video.likes.splice(video.likes.indexOf(this.state.user_id), 1);
        videoID = video.id;
        likes = video.likes;
      }
      return video;
    })
    let data = {};
    data['id'] = videoID;
    data['likes'] = likes;
    PageService.update_video(data).then(function(res) {
      if (res.data.success) {
        self.setState({
          videos: videos,
          type: '',
        })
      } else {
        console.log('fail');
      }
    })
  }

  onCopiedURL = () => {
    this.setState({type: "success", message: "Copied URL!"});
    this.showToastr();
  }

  render()
  {
    let { user_id, videos, isDelModal, embededtitle, description, thumnbnail, currentUrl, hashtag } = this.state;
    let encodedURL = encodeURI(currentUrl);
    let encodedText = encodeURI('BigData666 for gamers');
    return(
      <>
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
      <Container fluid className="p-3 video-section">
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
                            </FacebookShareButton>
                          </DropdownItem>
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
                          {
                            user_id == videos[rowData].user_id && (
                              <DropdownItem onClick={()=>this.delModal(index)}><Translation>{(t, { i18n }) => <option value="0">{t('Delete')}</option>}</Translation></DropdownItem>
                            )
                          }
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
                                videos[rowData].likes.indexOf(user_id) > -1 ? (
                                  <>
                                    <img className="cursor-pointer" src={Like} alt={'like'} onClick={() => this.onUnLikeVideo(index)} />
                                    <p className="m-0 likes-title">{videos[rowData].likes.length} Likes</p>
                                  </>
                                ) : (
                                  <>
                                    <img className="cursor-pointer" src={Unlike} alt={'unlike'} onClick={() => this.onLikeVideo(index)} />
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
        <div>
          <Modal isOpen={isDelModal} toggle={() => this.setState({isDelModal: false, type: ''})} centered={true} size="sm">
            <ModalBody className="text-center">
              <div>
                <h3 className="mt-3 mb-3"><b><Translation>{(t, { i18n }) => <>{t('Alert')}</>}</Translation></b></h3>
                <h4 className="mb-4 mr-auto ml-auto text-center" style={{maxWidth: '240px'}}><Translation>{(t, { i18n }) => <>{t('DeleteVideoComment')}</>}</Translation></h4>
                <Row>
                  <Col>
                    <Button  size="lg" onClick={() => this.setState({isDelModal: false, type: ''})} style={{backgroundColor: '#C4C4C4', borderColor: '#C4C4C4', color: '#fff'}}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                  </Col>
                  <Col>
                    <Button size="lg" onClick={this.onDeleteVideo} style={{backgroundColor: '#30D066', borderColor: '#30D066', color: '#fff'}}><Translation>{(t, { i18n }) => <>{t('Delete')}</>}</Translation></Button>
                  </Col>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Container>
      </>
    )
  }
}

export default Videos;