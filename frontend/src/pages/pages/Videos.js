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
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { toastr } from "react-redux-toastr";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserClock, faClock, faUpload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { XCircle, MoreVertical, Plus } from "react-feather";
import Unlike from "../../assets/img/UnLike.png";
import Like from "../../assets/img/Like.png";
import superuserBadge from "../../assets/img/gold.png";
import $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import { fade, makeStyles } from '@material-ui/core/styles';
import * as PageService from "../../action/page";
import * as UserService from '../../action/user';
import config from '../../config';

const APIUrl = config.server.APIUrl;
const Domain = config.server.Domain;

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

class Videos extends Component
{
  update_status = false;
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      videos: [],
      embedCodeTitle: '',
      embedCodeDescription: '',
      embedCode: '',
      tags: [],
      tagInput: '',
      categorySelect: '',
      thumbnail: APIUrl + 'upload/thumbnail.jpg',
      uploadThumbnail: '',
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
      isSuperUserModalOpen: false,
      isCheckedTAP: false,
      youtube_account_url: '',
      twitch_account_url: '',
      vimeo_account_url: '',
      discord_account_url: ''
    }
  }

  componentWillUnmount() {}
  componentWillMount() {}
  componentDidUpdate() {
    if (this.state.type === 'error') {
      this.showToastr();
    }
    if (this.update_status) {
      this.update_status = false;
    }
  }
  
  async componentDidMount() {
    let self = this;
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    this.setState({
      user_id: userinfo['id'],
      is_uploadRole: userinfo['super_user']
    })

    PageService.get_videos({active: 1}).then(function(res) {
      if (res.data.success) {
        // console.log('success');

        let videos = res.data.videos;
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
            stack['hashTags'] = videos[index]['tags'] ? '#' + videos[index]['tags'].replaceAll(',', ',#') : '#tutorial';
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

    try {
      const res = await UserService.get_settings({context: 'Notification'});
      if (res.data.settings.data) {
        let data = JSON.parse(res.data.settings.data);
        let updated_at = new Date(res.data.settings.updated_at);
        let notification_time = window.localStorage.getItem('notification_time');
        if (notification_time) {
          if (parseInt(notification_time, 10) - updated_at.getTime() == 0) {
            this.setState({
              show_notification: false
            })
          }
        }
        this.setState({
          bar_message: data.bar_message,
          enable_bar_click: data.enable_bar_click,
          on_click_go_to: data.on_click_go_to,
          open_in_a_new_tab: data.open_in_a_new_tab,
          show_button: data.show_button,
          button_text: data.button_text,
          button_color: data.button_color,
          button_text_color: data.button_text_color,
          show_discount_code: data.show_discount_code,
          discount_code: data.discount_code,
          text_color: data.text_color,
          coupon_code_color: data.coupon_code_color,
          background_left_color: data.background_left_color,
          background_right_color: data.background_right_color,
          show_shadow: data.show_shadow,
          notification_time: updated_at.getTime()
        })
        if (!data.show_shadow) {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + data.background_left_color + ', ' + data.background_left_color +')'},
            message_style: {color: data.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: data.text_color},
            button_style: {backgroundColor: data.button_color, borderColor: data.button_color, color: data.button_text_color},
            close_style: {color: data.coupon_code_color, cursor: 'pointer'}
          })
        } else {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + data.background_left_color + ', ' + data.background_right_color +')'},
            message_style: {color: data.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: data.text_color},
            button_style: {backgroundColor: data.button_color, borderColor: data.button_color, color: data.button_text_color},
            close_style: {color: data.coupon_code_color, cursor: 'pointer'}
          })
        }
      } else {
        this.setState({
          show_notification: false
        })
        if (!this.state.show_shadow) {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + this.state.background_left_color + ', ' + this.state.background_left_color +')'},
            message_style: {color: this.state.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: this.state.text_color},
            button_style: {backgroundColor: this.state.button_color, borderColor: this.state.button_color, color: this.state.button_text_color},
            close_style: {color: this.state.coupon_code_color, cursor: 'pointer'}
          })
        } else {
          this.setState({
            notification_style: {backgroundImage: 'linear-gradient(to right, ' + this.state.background_left_color + ', ' + this.state.background_right_color +')'},
            message_style: {color: this.state.text_color},
            discount_btn_style: {border: '1px #FFF dashed', backgroundColor: 'transparent', color: this.state.text_color},
            button_style: {backgroundColor: this.state.button_color, borderColor: this.state.button_color, color: this.state.button_text_color},
            close_style: {color: this.state.coupon_code_color, cursor: 'pointer'}
          })
        }
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error
      });
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
    this.update_status = true;
  }
  
  removeTag = (i) => {
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tags: newTags, type: '' });
  }

  inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val], tagInput: '', type: ''});
    }
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

  upload = () => {
    $('#thumbnail').click();
  }

  onChange = e => {
    let self = this;
    if (e.target.files.length) {
      const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (types.every(type => e.target.files[0].type !== type)) {
        this.setState({
          type: "error",
          message: "Please Select Image File!"
        });
        return;
      }

      if (e.target.files[0].size > 2000000) {
        this.setState({
          type: "error",
          message: "'"+ e.target.files[0].name + "' is too large, please pick a smaller file"
        });
        return;
      }
      this.setState({
        thumbnail: URL.createObjectURL(e.target.files[0]),
        uploadThumbnail: e.target.files[0],
        type: ''
      })
    }
  }

  addVideo = () => {
    let self = this;
    let embedCodeTitle = this.state.embedCodeTitle;
    let embedCodeDescription = this.state.embedCodeDescription;
    let embedCode = this.state.embedCode;
    let tags = this.state.tags;
    let category = this.state.categorySelect;
    let uploadThumbnail = this.state.uploadThumbnail;
    if(!embedCodeTitle) {
      this.setState({
        type: "error",
        message: "Please Insert Video Blog Title!"
      });
      return;
    }
    if(!embedCodeDescription) {
      this.setState({
        type: "error",
        message: "Please Insert Video Blog Description!"
      });
      return;
    }
    if(!embedCode) {
      this.setState({
        type: "error",
        message: "Please Insert Embedded Code!"
      });
      return;
    }
    if(!uploadThumbnail) {
      this.setState({
        type: "error",
        message: "Please Upload Thumbnail Image!"
      });
      return;
    }

    if (tags.length < 1) {
      this.setState({
        type: "error",
        message: "Please Insert Hashtag!"
      });
      return;
    }

    if (category < 1) {
      this.setState({
        type: "error",
        message: "Please Select Category!"
      });
      return;
    }
    let arrayEmbedCode = embedCode.split('src="');
    if (arrayEmbedCode.length < 2) {
      this.setState({
        type: "error",
        message: "Please Insert Embedded Code Correctly!"
      });
      return;
    }
    arrayEmbedCode = arrayEmbedCode[1].split('" ');

    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    let data = {};
    data['user_id'] = userinfo['id'];
    data['title'] = embedCodeTitle;
    data['description'] = embedCodeDescription;
    data['embed_url'] = arrayEmbedCode[0];
    data['tags'] = tags.toString();
    data['category'] = parseInt(category, 10);

    const formData = new FormData();
    formData.append("fileImg", uploadThumbnail);

    PageService.thumbnail_image(formData).then(function(res) {
      if (res.data.success) {
        data['thumbnail_url'] = res.data.file;

        PageService.new_videoembedcode(data).then(function(res) {
          if (res.data.success) {
            self.setState({
              type: "success",
              message: "Video Embed Code has added successful!",
              addVideo: false,
              embedCodeTitle: '',
              embedCodeDescription: '',
              embedCode: '',
              tags: [],
              categorySelect: 0,
              thumbnail: APIUrl + 'upload/thumbnail.jpg',
              uploadThumbnail: ''
            });
            self.showToastr();
          } else {
            console.log('fail');
          }
        })
      } else {
        self.setState({
          type: "error",
          message: "Server Error"
        });
      }
    })
    
  }

  none() {
    console.log('Disable go to url.');
  }

  onClickNotify = () => {
    if (this.state.open_in_a_new_tab) {
      window.open(this.state.on_click_go_to, '_blank');
    } else {
      window.open(this.state.on_click_go_to, '_self');
    }
  }

  onHideNotification = (event) => {
    this.setState({
      show_notification: false,
      type: ''
    })
    window.localStorage.setItem('notification_time', this.state.notification_time);
    event.stopPropagation();
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

  onSubmitSuperUser = async() => {
    if (this.state.youtube_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.youtube_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Youtube account URL is not valid URL!"
      });
      return;
    } else if (this.state.twitch_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.twitch_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Twitch account URL is not valid URL!"
      });
      return;
    } else if (this.state.vimeo_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.vimeo_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Vimeo account URL is not valid URL!"
      });
      return;
    } else if (this.state.discord_account_url && !/^(ftp|http|https):\/\/[^ "]+$/.test(this.state.discord_account_url)) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Your Discord account URL is not valid URL!"
      });
      return;
    } else if (!this.state.youtube_account_url && !this.state.twitch_account_url && !this.state.vimeo_account_url && !this.state.discord_account_url) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Please enter your account URL!"
      });
      return;
    }
    if (!this.state.isCheckedTAP) {
      this.setState({
        title: "Result",
        type: "error",
        message: "Please Check Terms and Policy!"
      });
      return;
    }
    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    let self = this;
    let data = {
      youtube_account_url: this.state.youtube_account_url,
      twitch_account_url: this.state.twitch_account_url,
      vimeo_account_url: this.state.vimeo_account_url,
      discord_account_url: this.state.discord_account_url
    }
    try {
      const res = await UserService.update_profile({id: userinfo['id'], super_user: 1, streaming_account: JSON.stringify(data)});
      if (res.data.success) {
        this.setState({
          title: "Result",
          type: "success",
          message: "Your account will be reviewed  within 24 hours.",
          isSuperUserModalOpen: false,
          is_uploadRole: 1
        });
        this.showToastr();
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.userinfo));
      } else {
        this.setState({
          title: "Result",
          type: "error",
          message: res.data.error,
          isSuperUserModalOpen: false
        });
        console.log('fail');
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error,
        isSuperUserModalOpen: false
      });
    }
  }

  onCopiedURL = () => {
    this.setState({type: "success", message: "Copied URL!"});
    this.showToastr();
  }

  render()
  {
    let { user_id, videos, searchResult, addVideo, is_uploadRole, notification_style, message_style, bar_message, show_discount_code, discount_btn_style, discount_code, show_button, button_style, button_text, close_style, show_notification, enable_bar_click, isDelModal, tags, tagInput, searchTags, searchTagInput, searchVideos, isCheckedTAP, youtube_account_url, twitch_account_url, vimeo_account_url, discord_account_url } = this.state;
    let currentUrl = 'https://' + Domain + '/blogs/';
    let encodedURL = encodeURI('https://' + Domain + '/blogs/');
    let currentTitle = 'BigData666 for gamers';
    let encodedText = encodeURI('BigData666 for gamers');
    return(
      <Container fluid className="p-0 video-section">
        {
          show_notification && (
            <div className="w-100 d-flex p-3" style={notification_style} onClick={enable_bar_click ? this.onClickNotify : this.none}>
              <div className="mr-auto ml-auto">
                <span className="mt-auto mb-auto mr-3" style={message_style}>{bar_message}</span>
                {
                  show_discount_code && (<Button size="lg" className="mr-3" style={discount_btn_style}>{discount_code}</Button>)
                }
                {
                  show_button && (<Button size="lg" style={button_style} onClick={this.onClickNotify}>{button_text}</Button>)
                }
              </div>
              <XCircle size={20} className="mt-auto mb-auto float-right" style={close_style} onClick={(e) => this.onHideNotification(e)} />
            </div>
          )
        }
        <Row className="m-0 pt-3">
          <Col>
            <Card className={searchResult ? 'flex-fill w-100 video-search-header-section': 'flex-fill w-100 video-search-header-false-section'}>
              <CardHeader className="video-search-header-section">
                <Row className="m-0">
                  <Col xl="8" lg="7" md="7" className="mt-1 mb-1">
                    <InputGroup className="mr-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText className="video-fa-search-bar pr-0">
                          <FontAwesomeIcon
                            className="align-middle"
                            icon={faSearch}
                            fixedWidth
                          />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Translation>{(t, { i18n }) => 
                        <>
                          <Input
                            type="text"
                            placeholder={t('SearchVideos')}
                            aria-label="Search"
                            className="form-control-no-border video-input-search-bar"
                            value={searchTagInput}
                            onKeyDown={this.inputSearchKeyDown}
                            onChange={(e) => this.handleChange('searchTagInput', e.target.value)}
                          />
                        </>}
                      </Translation>
                    </InputGroup>
                    {
                      searchTags.length > 0 && (
                        <ul className="input-tag__tags mt-2">
                          { searchTags.map((tag, i) => (
                            <li key={tag}>
                              {tag}
                              <XCircle size={15} className="ml-2" style={{color: '#000', cursor: 'pointer'}} onClick={() => this.removeSearchTag(i)} />
                            </li>
                          ))}
                        </ul>
                      )
                    }
                  </Col>
                  <Col xl="4" lg="5" md="5" className="d-flex mt-1 mb-1">
                    <CustomInput
                      type="select"
                      id="exampleCustomSelect"
                      name="customSelect"
                      className="mr-3"
                      style={{height: '50px', borderRadius: '8px'}}
                      onChange={(e) => this.handleChange('searchCategorySelect', e.target.value)}
                    >
                      <Translation>{(t, { i18n }) => <option value="0">{t('SelectCategory')}</option>}</Translation>
                      <Translation>{(t, { i18n }) => <option value="1">{t('Roulette')}</option>}</Translation>
                      <Translation>{(t, { i18n }) => <option value="2">{t('BlackJack')}</option>}</Translation>
                      <Translation>{(t, { i18n }) => <option value="3">{t('Baccarat')}</option>}</Translation>
                      <Translation>{(t, { i18n }) => <option value="4">{t('RouletteRobot')}</option>}</Translation>
                      <Translation>{(t, { i18n }) => <option value="5">{t('Tutorial')}</option>}</Translation>
                    </CustomInput>
                    <Button size="lg" className="black_keyboard search-btn" onClick={this.onSearchVideo}><Translation>{(t, { i18n }) => <>{t('Search')}</>}</Translation></Button>
                  </Col>
                </Row>
              </CardHeader>
              {
                searchResult && (
                  <CardBody className="video-search-body-section">
                    <div className="d-flex">
                      <Button className="black_keyboard ml-auto" onClick={this.onRemoveSearchResult}><Translation>{(t, { i18n }) => <option value="0">{t('Clear')}</option>}</Translation></Button>
                    </div>
                    {
                      searchVideos.length > 0 ? (
                        <>
                        <Row className="m-0 mt-3" >
                        {
                          Object.keys(searchVideos).map((rowData, index) => {
                            return (
                              <Col xl="4" lg="4" md="6" sm="6" className="w-100" key={index}>
                                <Card className="flex-fill w-100">
                                  <CardHeader>
                                    <div style={{display: 'flex'}}>
                                      <img
                                        src={videos[rowData].avatar}
                                        className="avatar img-fluid rounded-circle mr-1 mt-0 mb-0"
                                        alt="User Avatar"
                                      />
                                      <div>
                                        <p className="align-middle mb-0"> {searchVideos[rowData].username} </p>
                                        <p className="align-middle mb-0"> {searchVideos[rowData].date} </p>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <div className="video-wrp">
                                    <Link to={'/videos/' + videos[rowData].id}><div style={{zIndex: 3, position: 'absolute', width: '100%', height: '100%'}}></div></Link>
                                    <iframe className="embedIframe" src={searchVideos[rowData].url} frameBorder="0" allowFullScreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>
                                  </div>
                                  <CardBody>
                                    <Row className="m-0">
                                      <Col className="tags-group p-0" xl="10" lg="9" md="9">
                                        <ul className="input-tag__tags">
                                        { searchVideos[rowData].tags.map((tag, i) => (
                                          <li key={tag}>
                                            {tag}
                                          </li>
                                        ))}
                                        </ul>
                                      </Col>
                                      <Col className="likes-group p-0 text-center d-flex" xl="2" lg="3" md="3">
                                        <div className="align-middle m-auto">
                                          {
                                            searchVideos[rowData].likes.indexOf(user_id) > -1 ? (
                                              <>
                                                <img className="cursor-pointer" src={Like} alt={'like'} onClick={() => this.onUnLikeVideo(index)} />
                                                <p className="m-0 likes-title">{searchVideos[rowData].likes.length} Likes</p>
                                              </>
                                            ) : (
                                              <>
                                                <img className="cursor-pointer" src={Unlike} alt={'unlike'} onClick={() => this.onLikeVideo(index)} />
                                                <p className="m-0 likes-title">{searchVideos[rowData].likes.length} Likes</p>
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
                        <p>{searchVideos.length} <Translation>{(t, { i18n }) => <>{t('Results')}</>}</Translation></p>
                        </>
                      ) : (
                        <p><Translation>{(t, { i18n }) => <>{t('NoResult')}</>}</Translation>!</p>
                      )
                    }
                  </CardBody>
                )
              }
            </Card>
          </Col>
        </Row>
        {
          is_uploadRole > 1 ? (
            <Row className="m-0 mt-3" >
            {
              addVideo ? (
                <>
                  <Col xl="6" lg="6" md="6" sm="6" className="w-100">
                    <Card className="flex-fill w-100">
                      <CardBody>
                        <Translation>{(t, { i18n }) => 
                          <>
                            <Input
                              type="text"
                              placeholder={t('Title')}
                              className=""
                              onChange={(e) => this.handleChange('embedCodeTitle', e.target.value)}
                            />
                          </>}
                        </Translation>
                        <Translation>{(t, { i18n }) => 
                          <>
                            <Input
                              type="textarea"
                              rows="4"
                              placeholder={t('Description')}
                              className="mt-2"
                              onChange={(e) => this.handleChange('embedCodeDescription', e.target.value)}
                            />
                          </>}
                        </Translation>
                        <Translation>{(t, { i18n }) => 
                          <>
                            <Input
                              type="textarea"
                              rows="4"
                              placeholder={t('InputEmbedComment')}
                              className="mt-2"
                              onChange={(e) => this.handleChange('embedCode', e.target.value)}
                            />
                          </>}
                        </Translation>
                        <div className="text-center">
                          <img
                            alt="Thumbnail"
                            src={this.state.thumbnail}
                            className="img-thumbnail img-responsive mt-2"
                            width="200"
                            height="128"
                          />
                          <div className="mt-2">
                            <input type="file" id="thumbnail" onChange={this.onChange} />
                            <Button color="primary" onClick={this.upload}>
                              <FontAwesomeIcon icon={faUpload} /> <Translation>{(t, { i18n }) => <>{t('ThumbnailUpload')}</>}</Translation>
                            </Button>
                          </div>
                          <small>
                            <Translation>{(t, { i18n }) => <>{t('FormatComment')}</>}</Translation>
                          </small>
                        </div>
                        <Row className="mt-2">
                          <Col lg="8" className="mt-2">
                            <Translation>{(t, { i18n }) => 
                              <>
                                <Input
                                  type="text"
                                  placeholder={t('TypeAnyHashtag')}
                                  className="md-1"
                                  value={tagInput}
                                  onKeyDown={this.inputKeyDown}
                                  onChange={(e) => this.handleChange('tagInput', e.target.value)}
                                />
                              </>}
                            </Translation>
                            <ul className="input-tag__tags mt-2">
                              { tags.map((tag, i) => (
                                <li key={tag}>
                                  {tag}
                                  <XCircle size={15} className="ml-2" style={{color: '#000', cursor: 'pointer'}} onClick={() => this.removeTag(i)} />
                                </li>
                              ))}
                            </ul>
                          </Col>
                          <Col lg="4" className="mt-2">
                            <CustomInput
                              type="select"
                              id="exampleCustomSelect"
                              name="customSelect"
                              onChange={(e) => this.handleChange('categorySelect', e.target.value)}
                            >
                              <Translation>{(t, { i18n }) => <option value="0">{t('SelectCategory')}</option>}</Translation>
                              <Translation>{(t, { i18n }) => <option value="1">{t('Roulette')}</option>}</Translation>
                              <Translation>{(t, { i18n }) => <option value="2">{t('BlackJack')}</option>}</Translation>
                              <Translation>{(t, { i18n }) => <option value="3">{t('Baccarat')}</option>}</Translation>
                              <Translation>{(t, { i18n }) => <option value="4">{t('RouletteRobot')}</option>}</Translation>
                              <Translation>{(t, { i18n }) => <option value="5">{t('Tutorial')}</option>}</Translation>
                            </CustomInput>
                          </Col>
                        </Row>
                        <div inline="true" className="mt-2 float-right d-flex">
                          <Button size="lg" className="mr-2 primary_btn" onClick={() => this.setState({addVideo: false})}>
                            <Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation>
                          </Button>
                          <Button size="lg" className="primary_btn" onClick={this.addVideo}>
                            <Translation>{(t, { i18n }) => <>{t('Add')}</>}</Translation>
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="d-flex mt-2">
                    <div className="ml-auto">
                      <span style={{color: '#fff', fontSize: '20px'}}><Translation>{(t, { i18n }) => <>{t('SortBy')}</>}</Translation>:</span>
                      <CustomInput
                        type="select"
                        id="exampleCustomSelect"
                        name="customSelect"
                        className="ml-3 mr-3"
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
                </>
              ) : (
                <>
                  <Col xl="4" lg="4" md="6" sm="6" className="w-100">
                    {/* <Card className="flex-fill w-100 text-center" style={{backgroundColor: '#2D1C1C', border: '1px solid #ddd'}} onClick={() => this.setState({addVideo: true})}>
                      <CardBody>
                        <Plus size={30} className="align-middle" style={{color: '#fff', fontWeight: 'bold'}} />
                      </CardBody>
                    </Card> */}
                    <Link to="/settings">
                      <img
                        src={superuserBadge}
                        className="img-responsive mt-2 mr-2 cursor-pointer"
                        width="50"
                        height="50"
                        // onClick={() => this.setState({addVideo: true})}
                      />
                    </Link>
                    <Button className="Add-Video-btn" onClick={() => this.setState({addVideo: true})}>
                      <Translation>{(t, { i18n }) => <>{t('AddVideo')}</>}</Translation>
                    </Button>
                  </Col>
                  <Col className="d-flex mt-2">
                    <div className="ml-auto">
                      <span style={{color: '#fff', fontSize: '20px'}}><Translation>{(t, { i18n }) => <>{t('SortBy')}</>}</Translation>:</span>
                      <CustomInput
                        type="select"
                        id="exampleCustomSelect"
                        name="customSelect"
                        className="ml-3 mr-3"
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
                </>
              )
            }
            </Row>
          ) : (
            <Row className="m-0">
              <Col className="mt-2">
                {
                  is_uploadRole == 1 ? (
                    <Button className="Become-superuser-btn">
                      <Translation>{(t, { i18n }) => <>{t('InProgress')}</>}</Translation>
                    </Button>
                  ) : (
                    <Button className="Become-superuser-btn" onClick={() => this.setState({isSuperUserModalOpen: true, type: ''})}>
                      <Translation>{(t, { i18n }) => <>{t('BecomeSuperuser')}</>}</Translation>
                    </Button>
                  )
                }
              </Col>
              <Col className="d-flex mt-2">
                <div className="ml-auto">
                  <span style={{color: '#fff', fontSize: '20px'}}><Translation>{(t, { i18n }) => <>{t('SortBy')}</>}</Translation>:</span>
                  <CustomInput
                    type="select"
                    id="exampleCustomSelect"
                    name="customSelect"
                    className="ml-3 mr-3"
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
          )
        }
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
                  <div className="video-wrp">
                    <Link to={'/videos/' + videos[rowData].id}><div style={{zIndex: 3, position: 'absolute', width: '100%', height: '100%'}}></div></Link>
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
        <div>
          <Modal isOpen={this.state.isSuperUserModalOpen} toggle={() => this.setState({isSuperUserModalOpen: false, type: ''})} centered={true} size="md">
            <ModalBody>
              <div className="p-4">
                <h3 className="mt-3 mb-4 text-center"><b><Translation>{(t, { i18n }) => <>{t('SuperUserProgramForm')}</>}</Translation></b></h3>
                <Translation>{(t, { i18n }) => 
                  <>
                    <RedditTextField
                      label={t('YoutubeAccount')}
                      placeholder="https://"
                      className="w-100 mt-3 mb-3"
                      variant="filled"
                      id="youtube_account_url"
                      type="text"
                      name="youtube_account_url"
                      value={youtube_account_url}
                      onChange={(e) => {this.handleChange("youtube_account_url", e.target.value)}}
                    />
                  </>}
                </Translation>
                <Translation>{(t, { i18n }) => 
                  <>
                    <RedditTextField
                      label={t('TwitchAccount')}
                      placeholder="https://"
                      className="w-100 mt-3 mb-3"
                      variant="filled"
                      id="twitch_account_url"
                      type="text"
                      name="twitch_account_url"
                      value={twitch_account_url}
                      onChange={(e) => {this.handleChange("twitch_account_url", e.target.value)}}
                    />
                  </>}
                </Translation>
                <Translation>{(t, { i18n }) => 
                  <>
                    <RedditTextField
                      label={t('VimeoAccount')}
                      placeholder="https://"
                      className="w-100 mt-3 mb-3"
                      variant="filled"
                      id="vimeo_account_url"
                      type="text"
                      name="vimeo_account_url"
                      value={vimeo_account_url}
                      onChange={(e) => {this.handleChange("vimeo_account_url", e.target.value)}}
                    />
                  </>}
                </Translation>
                <Translation>{(t, { i18n }) => 
                  <>
                    <RedditTextField
                      label={t('DiscordAccount')}
                      placeholder="https://"
                      className="w-100 mt-3 mb-3"
                      variant="filled"
                      id="discord_account_url"
                      type="text"
                      name="discord_account_url"
                      value={discord_account_url}
                      onChange={(e) => {this.handleChange("discord_account_url", e.target.value)}}
                    />
                  </>}
                </Translation>
                <h3 className="mt-3 mb-4 text-justify" style={{color: '#ff0000'}}><b><Translation>{(t, { i18n }) => <>{t('StreamingAccountComment')}</>}</Translation></b></h3>
                <div className="text-left">
                  <div className="filter-selector mb-3 d-flex">
                    <div>
                      <CustomInput
                        type="checkbox"
                        id="check_tap"
                        checked={isCheckedTAP ? true : false}
                        onChange={(e) => {this.handleChange("isCheckedTAP", e.target.checked)}}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <span className="By-checking-the-box"><Translation>{(t, { i18n }) => <>{t('UnderstandChecking')}</>}</Translation>  <a href="https://bigdata666.net/pages/terms" className="TAP" target="blank"><Translation>{(t, { i18n }) => <>{t('MoreTermsConditions')}</>}</Translation></a></span>
                    </div>
                  </div>
                </div>
                <Row>
                  <Col className="text-center align-self-center">
                    <Button size="lg" onClick={() => this.setState({isSuperUserModalOpen: false, type: ''})} style={{backgroundColor: '#C4C4C4', borderColor: '#C4C4C4', color: '#fff'}}><Translation>{(t, { i18n }) => <>{t('Cancel')}</>}</Translation></Button>
                  </Col>
                  <Col className="text-center">
                    <Button size="lg" style={{backgroundColor: '#30D066', borderColor: '#30D066', color: '#fff'}} onClick={this.onSubmitSuperUser}><Translation>{(t, { i18n }) => <>{t('Submit')}</>}</Translation></Button>
                  </Col>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </Container>
    )
  }
}

export default Videos;