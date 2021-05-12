import React from "react";
import { connect } from "react-redux";
import { enableCorporateTheme } from "../../redux/actions/themeActions";

import Dashboard from "../dashboards";

class ThemeCorporate extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(enableCorporateTheme());
  }

  render() {
    return <Dashboard />;
  }
}

export default connect()(ThemeCorporate);
