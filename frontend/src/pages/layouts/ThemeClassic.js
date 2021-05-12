import React from "react";
import { connect } from "react-redux";
import { enableClassicTheme } from "../../redux/actions/themeActions";

import Dashboard from "../dashboards";

class ThemeClassic extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(enableClassicTheme());
  }

  render() {
    return <Dashboard />;
  }
}

export default connect()(ThemeClassic);
