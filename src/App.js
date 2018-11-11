import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Router, Route, Switch } from "react-router-dom";
import { Drawer, NavigationDrawer, Snackbar } from "react-md";
import { Helmet } from "react-helmet";

import "./App.scss";
import NavItemLink from "./NavItemLink";
import ReadTrainer from "./ReadTrainer/ReadTrainer";
import Settings from "./Settings";
import About from "./About";
import WhatsNew from "./WhatsNew";
import { pageview } from "./analytics";

const navItems = [
  {
    label: "Read trainer",
    to: "/",
    exact: true,
    icon: "hearing"
  },
  {
    label: "Settings",
    to: "/settings",
    icon: "settings"
  },
  {
    label: "What's new",
    to: "/whatsnew",
    icon: "new_releases"
  },
  {
    label: "About",
    to: "/about",
    icon: "info"
  }
];

const App = inject("store")(
  observer(
    class App extends Component {
      componentWillMount() {
        this.unlisten = this.props.history.listen(location => {
          pageview(location.pathname + location.search);
        });
      }

      componentWillUnmount() {
        this.unlisten();
      }

      render() {
        const store = this.props.store.appStore;
        const toasts = store.toasts.slice();
        const { autohide } = store;
        const { history } = this.props;

        return (
          <Router history={history}>
            <Route
              render={({ location }) => (
                <div className="fullscreen">
                  <Helmet
                    titleTemplate="Morse Camp - %s"
                    defaultTitle="Morse Camp"
                  />
                  <NavigationDrawer
                    toolbarTitle="Morse Camp"
                    desktopDrawerType={Drawer.DrawerTypes.CLIPPED}
                    navItems={navItems.map(props => (
                      <NavItemLink {...props} key={props.to} />
                    ))}
                    className="vcontainer"
                    contentClassName="fullscreen"
                  >
                    <div className="column-container">
                      <div className="side-filler" />
                      <div className="trainer-column">
                        <Switch key={location.key}>
                          <Route
                            path="/about"
                            location={location}
                            component={About}
                          />
                          <Route
                            path="/settings"
                            location={location}
                            component={Settings}
                          />
                          <Route
                            path="/whatsnew"
                            location={location}
                            component={WhatsNew}
                          />
                          <Route location={location} component={ReadTrainer} />
                        </Switch>
                      </div>
                      <div className="side-filler" />
                    </div>
                  </NavigationDrawer>
                  <Snackbar
                    id="snackbar"
                    toasts={toasts}
                    autohide={autohide}
                    onDismiss={store.dismissToast}
                  />
                </div>
              )}
            />
          </Router>
        );
      }
    }
  )
);
App.propTypes = {
  history: PropTypes.object.isRequired
};
export default App;
