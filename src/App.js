import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationDrawer, Snackbar } from "react-md";

import "./App.css";
import NavItemLink from "./NavItemLink";
import ReadTrainer from "./ReadTrainer";
import Settings from "./Settings";
import About from "./About";

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
      render() {
        const store = this.props.store.appStore;
        const toasts = store.toasts.slice();
        const { autohide } = store;

        return (
          <Router>
            <Route
              render={({ location }) => (
                <div>
                  <NavigationDrawer
                    drawerTitle="Morse Camp"
                    toolbarTitle="Morse Camp"
                    navItems={navItems.map(props => (
                      <NavItemLink {...props} key={props.to} />
                    ))}
                  >
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
export default App;
