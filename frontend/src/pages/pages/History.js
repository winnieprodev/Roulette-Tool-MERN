import React, { Component } from "react";
import { useTranslation, Translation } from 'react-i18next';
import {
  Card,
  CardBody,
  Button,
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserClock, faClock, faHotel, faSearch } from "@fortawesome/free-solid-svg-icons";
import StarRatingComponent from 'react-star-rating-component';
import * as PageService from '../../action/page';
import config from '../../config';

const APIUrl = config.server.APIUrl;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pageSize = [5, 10, 25, 50];

class History extends Component
{
  isPageOrder = false;
  constructor(props) {
    super(props);
    this.state = {
      pages: {},
      status: true,
      search_key: '',
      currentPage: 0,
      pagesCount: 0,
      pageSize: 0
    }
  }

  componentWillUnmount() {}
  componentWillMount() {}
  componentDidMount() {
    let self = this;
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    let send_data = {};
    send_data['user_id'] = userinfo['id'];
    send_data['dev'] = 0;
    PageService.get_histories(send_data).then(function(res) {
      if (res.data.success) {
        // console.log('success');

        let historyinfo = res.data.historyinfo;
        let page_group = {};
        
        if (historyinfo.length) {
          for (var index = 0; index < historyinfo.length; index++) {
            let created_at = new Date(res.data.historyinfo[index].created_at);
            created_at = created_at.getFullYear() + '-' + ('0' + (created_at.getMonth() + 1)).slice(-2) + '-' + created_at.getDate();
            let updated_at = new Date(res.data.historyinfo[index].updated_at);
            updated_at = months[updated_at.getMonth()] + ' '  + updated_at.getDate() + ' ' + updated_at.getFullYear() + ' '  + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();

            let stack = {};
            stack['id'] = res.data.historyinfo[index]['id'];
            stack['casino_name'] = res.data.historyinfo[index]['casino_name'];
            stack['dealer_name'] = res.data.historyinfo[index]['dealer_name'];
            stack['rating'] = res.data.historyinfo[index]['rating'];
            stack['dealer_avatar'] = res.data.historyinfo[index]['dealer_avatar'];
            stack['created_at'] = created_at;
            stack['updated_at'] = updated_at;

            if (!page_group[created_at]) {
              page_group[created_at] = [];
            }
            page_group[created_at].push(stack);
          }
          self.setState({
            pages: page_group,
            status: true,
            pagesCount: Math.ceil(Object.keys(page_group).length / pageSize[self.state.pageSize])
          })
        } else {
          self.setState({
            pages: page_group,
            status: false
          })
        }
      } else {
        console.log('fail');
      }
    })
  }
  
  componentDidUpdate() {
    if (this.isPageOrder) {
      this.isPageOrder = false;
      this.search();
    }
  }

  load_page = (key, index) => {
    let stack = {};
    stack['id'] = this.state.pages[key][index]['id'];
    stack['casino_name'] = this.state.pages[key][index]['casino_name'];
    stack['dealer_name'] = this.state.pages[key][index]['dealer_name'];
    stack['filter_status'] = false;
    stack['filter_num'] = 1;
    stack['active'] = 1;
    if (window.sessionStorage.getItem('page_row')) {
      let page_row = window.sessionStorage.getItem('page_row');
      page_row = JSON.parse(page_row);
      let add_status = true;
      for (var page_row_index = 0; page_row_index < page_row.length; page_row_index++) {
        if (page_row[page_row_index]['id'] === stack['id']) {
          add_status = false;
          if (page_row[page_row_index]['active'] === 1) {
            break;
          } else {
            page_row[page_row_index]['active'] = 1;
          }
        } else {
          page_row[page_row_index]['active'] = 0;
        }
      }

      if (add_status) {
        page_row.push(stack);
      }
      
      window.sessionStorage.setItem('page_row', JSON.stringify(page_row));
      window.location.href = '/';
    } else {
      let page_row = [];
      page_row.push(stack);
      window.sessionStorage.setItem('page_row', JSON.stringify(page_row));
      window.location.href = '/';
    }
  }

  delete_page = (id) => {
    let self = this;
    let data = {};
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    data['user_id'] = userinfo['id'];
    data['page_id'] = id;
    data['dev'] = 0;
    PageService.delete_page(data).then(function(res) {
      if (res.data.success) {
        // console.log('success')
        if (window.sessionStorage.getItem('page_row')) {
          let page_row = window.sessionStorage.getItem('page_row');
          page_row = JSON.parse(page_row);
          let add_status = true;
          for (var index = 0; index < page_row.length; index++) {
            if (page_row[index]['id'] === id) {
              if (page_row.length === 1) {
                window.sessionStorage.removeItem('page_row');
              } else {
                if (page_row[index]['active'] === 1) {
                  if (index === 0) {
                    add_status = false;
                    let reindex = index + 1;
                    page_row[reindex]['active'] = 1;
                    page_row.splice(index, 1);
                  } else {
                    add_status = false;
                    let reindex = index - 1;
                    page_row[reindex]['active'] = 1;
                    page_row.splice(index, 1);
                  }
                  break;
                } else {
                  add_status = false;
                  page_row.splice(index, 1);
                  break;
                }
              }
            }
          }
          if (!add_status) {
            window.sessionStorage.setItem('page_row', JSON.stringify(page_row));
          }
        }

        let historyinfo = res.data.historyinfo;
        let page_group = {};

        if (historyinfo.length) {
          for (var historyinfo_index = 0; historyinfo_index < historyinfo.length; historyinfo_index++) {
            let created_at = new Date(res.data.historyinfo[historyinfo_index].created_at);
            created_at = created_at.getFullYear() + '-' + ('0' + (created_at.getMonth() + 1)).slice(-2) + '-' + created_at.getDate();
            let updated_at = new Date(res.data.historyinfo[historyinfo_index].updated_at);
            updated_at = months[updated_at.getMonth()] + ' '  + updated_at.getDate() + ' ' + updated_at.getFullYear() + ' '  + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();

            let stack = {};
            stack['id'] = res.data.historyinfo[historyinfo_index]['id'];
            stack['casino_name'] = res.data.historyinfo[historyinfo_index]['casino_name'];
            stack['dealer_name'] = res.data.historyinfo[historyinfo_index]['dealer_name'];
            stack['rating'] = res.data.historyinfo[historyinfo_index]['rating'];
            stack['dealer_avatar'] = res.data.historyinfo[historyinfo_index]['dealer_avatar'];
            stack['created_at'] = created_at;
            stack['updated_at'] = updated_at;

            if (!page_group[created_at]) {
              page_group[created_at] = [];
            }
            page_group[created_at].push(stack);
          }
          self.setState({
            pages: page_group,
            status: true,
            pagesCount: Math.ceil(Object.keys(page_group).length / pageSize[self.state.pageSize])
          })
        } else {
          self.setState({
            pages: page_group,
            status: false
          })
        }
      } else {
        console.log('fail');
      }
    })
  }

  handleChange = (e) => {
    this.setState({
      search_key: e.target.value
    })
  }

  keyPress = (e) => {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search = () => {
    let send_data = {}
    let self = this;
    let userinfo = window.localStorage.getItem('userinfo');
    userinfo = JSON.parse(userinfo);
    send_data['user_id'] = userinfo['id'];
    send_data['search_key'] = this.state.search_key;
    send_data['dev'] = 0;
    
    if (this.state.search_key) {
      PageService.get_pages(send_data).then(function(res) {
        if (res.data.success) {
          // console.log('success');

          let historyinfo = res.data.historyinfo;
          let page_group = {};
          
          if (historyinfo.length) {
            for (var index = 0; index < historyinfo.length; index++) {
              let created_at = new Date(res.data.historyinfo[index].created_at);
              created_at = created_at.getFullYear() + '-' + ('0' + (created_at.getMonth() + 1)).slice(-2) + '-' + created_at.getDate();
              let updated_at = new Date(res.data.historyinfo[index].updated_at);
              updated_at = months[updated_at.getMonth()] + ' '  + updated_at.getDate() + ' ' + updated_at.getFullYear() + ' '  + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();

              let stack = {};
              stack['id'] = res.data.historyinfo[index]['id'];
              stack['casino_name'] = res.data.historyinfo[index]['casino_name'];
              stack['dealer_name'] = res.data.historyinfo[index]['dealer_name'];
              stack['rating'] = res.data.historyinfo[index]['rating'];
              stack['dealer_avatar'] = res.data.historyinfo[index]['dealer_avatar'];
              stack['created_at'] = created_at;
              stack['updated_at'] = updated_at;

              if (!page_group[created_at]) {
                page_group[created_at] = [];
              }
              page_group[created_at].push(stack);
            }
            self.setState({
              pages: page_group,
              status: true,
              pagesCount: Math.ceil(Object.keys(page_group).length / pageSize[self.state.pageSize])
            })
          } else {
            self.setState({
              pages: page_group,
              status: false
            })
          }
        } else {
          console.log('fail');
        }
      })
    } else {
      PageService.get_histories(send_data).then(function(res) {
        if (res.data.success) {
          // console.log('success');

          let historyinfo = res.data.historyinfo;
          let page_group = {};
          
          if (historyinfo.length) {
            for (var index = 0; index < historyinfo.length; index++) {
              let created_at = new Date(res.data.historyinfo[index].created_at);
              created_at = created_at.getFullYear() + '-' + ('0' + (created_at.getMonth() + 1)).slice(-2) + '-' + created_at.getDate();
              let updated_at = new Date(res.data.historyinfo[index].updated_at);
              updated_at = months[updated_at.getMonth()] + ' '  + updated_at.getDate() + ' ' + updated_at.getFullYear() + ' '  + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();

              let stack = {};
              stack['id'] = res.data.historyinfo[index]['id'];
              stack['casino_name'] = res.data.historyinfo[index]['casino_name'];
              stack['dealer_name'] = res.data.historyinfo[index]['dealer_name'];
              stack['rating'] = res.data.historyinfo[index]['rating'];
              stack['dealer_avatar'] = res.data.historyinfo[index]['dealer_avatar'];
              stack['created_at'] = created_at;
              stack['updated_at'] = updated_at;

              if (!page_group[created_at]) {
                page_group[created_at] = [];
              }
              page_group[created_at].push(stack);
            }
            self.setState({
              pages: page_group,
              status: true,
              pagesCount: Math.ceil(Object.keys(page_group).length / pageSize[self.state.pageSize])
            })
          } else {
            self.setState({
              pages: page_group,
              status: false
            })
          }
        } else {
          console.log('fail');
        }
      })
    }
  }

  handleClick(e, index) {
    
    e.preventDefault();

    this.setState({
      currentPage: index
    });
    
  }

  changePageNum = (e) => {
    this.setState({
      pageSize: parseInt(e.target.value, 10)
    })
    this.isPageOrder = true;
  }

  render()
  {
    const pages = this.state.pages;
    const status = this.state.status;
    const { currentPage } = this.state;
    return(
      <Container fluid className="p-3">
        <Row>
          <Col>
            <div inline="true" className="float-right d-flex">
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                className="mb-3 mr-2"
                onChange={this.changePageNum}
                style={{width: '200px'}}
              >
                <Translation>{(t, { i18n }) => <option value="0">5 {t('Days')}</option>}</Translation>
                <Translation>{(t, { i18n }) => <option value="1">10 {t('Days')}</option>}</Translation>
                <Translation>{(t, { i18n }) => <option value="2">25 {t('Days')}</option>}</Translation>
                <Translation>{(t, { i18n }) => <option value="3">100 {t('Days')}</option>}</Translation>
              </CustomInput>
              <InputGroup className="mb-3" >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="fa-search-bar pr-0">
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
                      placeholder={t('SearchHistory')}
                      aria-label="Search"
                      className="form-control-no-border"
                      onChange={this.handleChange}
                      onKeyDown={this.keyPress}
                    />
                  </>}
                </Translation>
                
              </InputGroup>
            </div>
          </Col>
        </Row>
        {
          !status ? (
            <h1 className="h3 mb-3 text-center"><Translation>{(t, { i18n }) => <>{t('NoPages')}</>}</Translation></h1>
          ) : (
            <div>
              {
                Object.keys(pages).slice(currentPage * pageSize[this.state.pageSize], (currentPage + 1) * pageSize[this.state.pageSize]).map((value, idx) => {
                  var date = new Date(value);
                  var current_date = months[date.getMonth()] + ' '  + date.getDate() + ' ' + date.getFullYear();
                  return (
                    <div key={idx}>
                      <h1 className="h3 mb-3 text-center">{current_date}</h1>
                      <Row>
                        {
                          pages[value].map((key, index) => {
                            return (
                              <Col xl="4" lg="4" md="6" sm="6" className="w-100" key={index}>
                                <Card>
                                  <CardBody>
                                  <Row>
                                    <Col>
                                      <div style={{fontSize: 25}}>
                                        <StarRatingComponent 
                                          name="star_rate" 
                                          starCount={5}
                                          value={key.rating}
                                          editing={false}
                                        />
                                      </div>
                                      <div>
                                        <FontAwesomeIcon
                                          className="align-middle mr-3"
                                          icon={faHotel}
                                          fixedWidth
                                        />
                                        <span style={{fontSize: 20}} className="align-middle">{key.casino_name}</span>
                                      </div>
                                      <div>
                                        <FontAwesomeIcon
                                          className="align-middle mr-3"
                                          icon={faUserClock}
                                          fixedWidth
                                        />
                                        <span className="align-middle">{key.dealer_name}</span>
                                      </div>
                                    </Col>
                                    <Col>
                                      {
                                        !key.dealer_avatar ? (
                                          <img
                                            alt="dealer avatar"
                                            src={APIUrl + 'upload/head.svg'}
                                            className="rounded img-responsive float-right"
                                            width="70"
                                            heigth="70"
                                          />
                                        ) : (
                                          <img
                                            alt="dealer avatar"
                                            src={APIUrl + key.dealer_avatar}
                                            className="rounded img-responsive float-right"
                                            width="70"
                                            heigth="70"
                                          />
                                        )
                                      }
                                    </Col>
                                  </Row>
                                  <div className="mt-2">
                                    <FontAwesomeIcon
                                      className="align-middle mr-3"
                                      icon={faClock}
                                      fixedWidth
                                    />
                                    <span className="align-middle">{key.updated_at}</span>
                                  </div>
                                  <Row>
                                    <Col className="text-center">
                                      <Button color="primary" size="md" className="mt-2" onClick={() => this.load_page(value, index)}>
                                      <Translation>{(t, { i18n }) => <>{t('Load')}</>}</Translation>
                                      </Button>
                                    </Col>
                                    <Col className="text-center">
                                      <Button color="danger" size="md" className="mt-2" onClick={() => this.delete_page(key.id)}>
                                        <Translation>{(t, { i18n }) => <>{t('Delete')}</>}</Translation>
                                      </Button>
                                    </Col>
                                  </Row>
                                  </CardBody>
                                </Card>
                              </Col>
                            )
                          })
                        }
                      </Row>
                    </div>
                  )
                })
              }
              <div className="pagination-wrapper">
            
                <Pagination aria-label="Page navigation example">
                  
                  <PaginationItem disabled={currentPage <= 0}>
                    
                    <PaginationLink
                      onClick={e => this.handleClick(e, currentPage - 1)}
                      previous
                      href="#"
                    />
                    
                  </PaginationItem>

                  {[...Array(this.state.pagesCount)].map((page, i) => 
                    <PaginationItem active={i === currentPage} key={i}>
                      <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem disabled={currentPage >= this.state.pagesCount - 1}>
                    
                    <PaginationLink
                      onClick={e => this.handleClick(e, currentPage + 1)}
                      next
                      href="#"
                    />
                    
                  </PaginationItem>
                  
                </Pagination>
                
              </div>
            </div>
          )
        }
      </Container>
    )
  }
}

export default History;