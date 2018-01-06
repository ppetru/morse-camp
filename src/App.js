import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Router, Route, Switch } from "react-router-dom";
import { NavigationDrawer, Snackbar } from "react-md";

import "./App.css";
import NavItemLink from "./NavItemLink";
import ReadTrainer from "./ReadTrainer/ReadTrainer";
import Settings from "./Settings";
import About from "./About";
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
                  <NavigationDrawer
                    toolbarTitle="Morse Camp"
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
