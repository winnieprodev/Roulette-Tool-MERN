import React from "react";
import { connect } from "react-redux";
import {
  enableStickySidebar,
  disableStickySidebar
} from "../../redux/actions/sidebarActions";

import Dashboard from "../dashboards";

class SidebarSticky extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(enableStickySidebar());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(disableStickySidebar());
  }

  render() {
    return <Dashboard />;
  }
}

export default connect()(SidebarSticky);
