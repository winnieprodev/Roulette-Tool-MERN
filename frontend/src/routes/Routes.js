import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import {
  landing as landingRoutes,
  defaultdashboard as defaultDashboardRoutes,
  dashboard as dashboardRoutes
} from "./index";
import DashboardLayout from "../layouts/Dashboard";
import LandingLayout from "../layouts/Landing";
import ScrollToTop from "../components/ScrollToTop";

const childRoutes = (Layout, routes) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          render={props => (
            <Layout>
              <Component {...props}/>
            </Layout>
          )}
        />
      ))
    ) : (
      // Route item without children
      <Route
        key={index}
        path={path}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    )
  );

const Routes = () => (
  <Router>
    <ScrollToTop>
      <Switch>
        {
          !window.localStorage.getItem('userinfo') && childRoutes(LandingLayout, landingRoutes)
        }
        {
          window.localStorage.getItem('userinfo') && childRoutes(DashboardLayout, dashboardRoutes)
        }
        {
          window.localStorage.getItem('userinfo') && childRoutes(LandingLayout, defaultDashboardRoutes)
        }
        <Redirect to={window.localStorage.getItem('userinfo') ? '/default-setting' : '/'} />
      </Switch>
    </ScrollToTop>
  </Router>
);

export default Routes;
