import React from "react";

import Main from "../components/Main";
import * as UserService from '../action/user';
import $ from 'jquery';

// const Landing = ({ children }) => <Main>{children}</Main>;

// export default Landing;
class Landing extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  async componentDidMount() {
    try {
      const res = await UserService.get_analytics();
      let analytics = res.data.analysis;
      for(var index = 0; index < analytics.length; index++) {
        if (analytics[index].status === 1) {
          if (analytics[index].analytic_position === 0) {
            $('head').append(analytics[index].analytic_script);
          } else if (analytics[index].analytic_position === 1) {
            $(analytics[index].analytic_script).insertBefore('#root');
          } else if (analytics[index].analytic_position === 2) {
            $('body').append(analytics[index].analytic_script);
          }
        }
      }
    } catch(error) {
      this.setState({
        type: "error",
        message: error,
        isToolModal: false
      });
    }
  }
  
  render()
  {
    return (
      <Main>
        {this.props.children}
      </Main>
    )
  }
}

export default Landing;