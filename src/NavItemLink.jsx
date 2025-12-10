import React from "react";
import PropTypes from "prop-types";
import { Link, useMatch } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

/**
 * Navigation item that highlights when its route is active.
 * Uses useMatch hook from React Router v6.
 */
const NavItemLink = ({ label, to, icon }) => {
  // In v6, routes are exact by default. Use end: true for exact matching on "/"
  const match = useMatch({ path: to, end: to === "/" });

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={to} selected={!!match}>
        {icon && (
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
        )}
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

NavItemLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  icon: PropTypes.node,
};
export default NavItemLink;
