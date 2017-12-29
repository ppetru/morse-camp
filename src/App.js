import React, { Component } from "react";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationDrawer, Snackbar } from "react-md";

import "./App.css";
import NavItemLink from "./NavItemLink";
import CopyTrainer from "./CopyTrainer";
import Settings from "./Settings";

const navItems = [
  {
    label: "Home",
    to: "/",
    exact: true,
    icon: "home"
  },
  {
    label: "Settings",
    to: `/settings`,
    icon: "settings"
  }
];

const App = inject("store")(
  observer(
    class App extends Component {
      state = {
        toasts: [],
        autohide: false
      };

      addToast = (text, action, autohide = false) => {
        this.setState(state => {
          const toasts = state.toasts.slice();
          toasts.push({ text, action });
          return { toasts, autohide };
        });
      };

      dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
      };

      componentWillMount() {
        this.cachedWatcher = autorun(() => {
          if (this.props.store.appStore.appCached) {
            this.addToast("App can now be used offline", "OK");
          }
        });

        this.updateWatcher = autorun(() => {
          if (this.props.store.appStore.updateAvailable) {
            this.addToast("New app version available", {
              children: "Reload",
              onClick: () => {
                window.location.reload(true);
              }
            });
          }
        });
      }

      componentWillUnmount() {
        this.cachedWatcher();
        this.updateWatcher();
      }

      render() {
        const { toasts, autohide } = this.state;

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
                        path="/settings"
                        location={location}
                        component={Settings}
                      />
                      <Route
                        location={location}
                        render={() => <CopyTrainer toast={this.upgradeToast} />}
                      />
                    </Switch>
                  </NavigationDrawer>
                  <Snackbar
                    id="snackbar"
                    toasts={toasts}
                    autohide={autohide}
                    onDismiss={this.dismissToast}
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
