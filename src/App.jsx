import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./App.scss";
import NavItemLink from "./NavItemLink.jsx";
import ReadTrainer from "./ReadTrainer/ReadTrainer.jsx";
import Settings from "./Settings.jsx";
import About from "./About.jsx";
import WhatsNew from "./WhatsNew.jsx";
import { pageview } from "./analytics.js";

const drawerWidth = 240;

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
  observer(({ store }) => {
    const [title, setTitle] = useState("Morse Camp");
    const [mobileOpen, setMobileOpen] = useState(false);
    const appStore = store.appStore;
    const toasts = appStore.toasts.slice();

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
      <List>
        {navItems.map((props) => (
          <NavItemLink {...props} key={props.to} />
        ))}
      </List>
    );

    return (
      <AppRoutes>
        <Box sx={{ display: "flex", height: "100%" }}>
          <Helmet
            titleTemplate="Morse Camp | %s"
            defaultTitle="Morse Camp"
            onChangeClientState={(newState) => setTitle(newState.title)}
          />
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <Toolbar /> {/* Spacer for AppBar */}
            {drawerContent}
          </Drawer>
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Toolbar /> {/* Spacer for AppBar */}
            {drawerContent}
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              height: "100%",
              overflow: "auto",
            }}
          >
            <Toolbar /> {/* Spacer for AppBar */}
            <Box className="column-container">
              <Box className="side-filler" />
              <Box className="trainer-column">
                <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/whatsnew" element={<WhatsNew />} />
                  <Route path="/" element={<ReadTrainer />} />
                </Routes>
              </Box>
              <Box className="side-filler" />
            </Box>
          </Box>
          <Snackbar
            open={toasts.length > 0}
            autoHideDuration={appStore.autohide ? 3000 : null}
            onClose={appStore.dismissToast}
            message={toasts.length > 0 ? toasts[0].text : ""}
          />
        </Box>
      </AppRoutes>
    );
  }),
);

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
