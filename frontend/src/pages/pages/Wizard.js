import React from "react";

import { Container, Row, Col } from "reactstrap";
import { useTranslation, Translation } from 'react-i18next';
import superuserBadge from "../../assets/img/gold.png";

import jQuery from "jquery";
const $ = jQuery;
window.jQuery = jQuery;

require("smartwizard/dist/js/jquery.smartWizard.min.js");

class WizardVariant extends React.Component {
  componentDidMount() {
    $(this.refs.smartwizard)
      .smartWizard({
        theme: this.props.variant, // default OR arrows
        showStepURLhash: false,
      })
  }
  render = () => {
    const { color, isSuperuser } = this.props;

    return (
      <div ref="smartwizard" className={`wizard wizard-${color} mb-4`}>
        <ul>
          <li className="active">
            <a href={`#step-1`}>
              <Translation>{(t, { i18n }) => <>{t('ApplicationSubmission')}</>}</Translation>
              <br />
              <small><Translation>{(t, { i18n }) => <>{t('Completed')}</>}</Translation></small>
            </a>
          </li>
          {
            isSuperuser == 1 ? (
              <li className="done">
                <a href={`#step-2`}>
                  <b style={{color: '#3D4EAC'}}><Translation>{(t, { i18n }) => <>{t('ApplicationReview')}</>}</Translation></b>
                  <br />
                  <small style={{color: '#3D4EAC'}}><Translation>{(t, { i18n }) => <>{t('InProgress')}</>}</Translation></small>
                </a>
              </li>
            ) : (
              <li className="active">
                <a href={`#step-2`}>
                  <Translation>{(t, { i18n }) => <>{t('ApplicationReview')}</>}</Translation>
                  <br />
                  <small><Translation>{(t, { i18n }) => <>{t('Completed')}</>}</Translation></small>
                </a>
              </li>
            )
          }
          
          <li>
            <div className="pl-5 pt-2" style={{color: '#3C4257', fontSize: '15px'}}><b><Translation>{(t, { i18n }) => <>{t('FinalDecision')}</>}</Translation></b></div>
            {
              isSuperuser == 2 && (
                <div className="pl-5" style={{color: '#4FD41A'}}><b><Translation>{(t, { i18n }) => <>{t('Approved')}</>}</Translation></b></div>
              )
            }
            {
              isSuperuser == 1 && (
                <div className="pl-5" style={{color: '#697386'}}><b><Translation>{(t, { i18n }) => <>{t('PleaseBePatient')}</>}</Translation></b></div>
              )
            }
            {
              isSuperuser == 0 && (
                <div className="pl-5" style={{color: '#E40000'}}><b><Translation>{(t, { i18n }) => <>{t('Disapproved')}</>}</Translation></b></div>
              )
            }
          </li>
          {
            isSuperuser == 2 && (
              <img
                src={superuserBadge}
                className="float-right img-responsive align-center ml-auto mt-1 mr-auto"
                width="50"
                height="50"
              />
            )
          }
        </ul>
      </div>
    );
  };
}

const Wizard = ({isSuperuser, approvedContext}) => (
  <Container fluid className="p-1">
    <h1 className="h3 mb-3"><b><Translation>{(t, { i18n }) => <>{t('SuperuserProgramStatus')}</>}</Translation></b></h1>
    <Row>
      <Col lg="9" xl="8" className="superuserWizardMaxwidth">
        <WizardVariant variant="arrows" color="success" isSuperuser={isSuperuser} />
      </Col>
      <Col lg="12" xl="4" className="superuserCommentMaxwidth">
        {
          isSuperuser == 0 && (<Translation>{(t, { i18n }) => <>{t('SorryToInform')}</>}</Translation>)
        }
        {
          isSuperuser == 1 && (<Translation>{(t, { i18n }) => <>{t('Reviewed24hours')}</>}</Translation>)
        }
        {
          isSuperuser == 2 && (<>{approvedContext}</>)
        }
      </Col>
    </Row>
  </Container>
);

export default Wizard;
