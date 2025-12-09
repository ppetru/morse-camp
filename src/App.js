import React, { Component, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
    icon: "hearing",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: "settings",
  },
  {
    label: "What's new",
    to: "/whatsnew",
    icon: "new_releases",
  },
  {
    label: "About",
    to: "/about",
    icon: "info",
  },
];

// Analytics hook - tracks page views
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
}

// Wrapper component to use hooks with class component
function AppRoutes({ children }) {
  usePageTracking();
  return children;
}

const AppContent = inject("store")(
  observer(
    class AppContent extends Component {
      state = { title: "Morse Camp" };

      render() {
        const store = this.props.store.appStore;
        const toasts = store.toasts.slice();
        const { autohide } = store;

        return (
          <AppRoutes>
            <div className="fullscreen">
              <Helmet
                titleTemplate="Morse Camp | %s"
                defaultTitle="Morse Camp"
                onChangeClientState={(newState) =>
                  this.setState({ title: newState.title })
                }
              />
              <NavigationDrawer
                toolbarTitle={this.state.title}
                desktopDrawerType={Drawer.DrawerTypes.CLIPPED}
                navItems={navItems.map((props) => (
                  <NavItemLink {...props} key={props.to} />
                ))}
                className="vcontainer"
                contentClassName="fullscreen"
              >
                <div className="column-container">
                  <div className="side-filler" />
                  <div className="trainer-column">
                    <Routes>
                      <Route path="/about" element={<About />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/whatsnew" element={<WhatsNew />} />
                      <Route path="/" element={<ReadTrainer />} />
                    </Routes>
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
          </AppRoutes>
        );
      }
    },
  ),
);

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
