import React from "react";
import PropTypes from "prop-types";
import { Link, useMatch } from "react-router-dom";
import { FontIcon, ListItem } from "react-md";

/**
 * Navigation item that highlights when its route is active.
 * Uses useMatch hook from React Router v6.
 */
const NavItemLink = ({ label, to, icon }) => {
  // In v6, routes are exact by default. Use end: true for exact matching on "/"
  const match = useMatch({ path: to, end: to === "/" });

  let leftIcon;
  if (icon) {
    leftIcon = <FontIcon>{icon}</FontIcon>;
  }

  return (
    <ListItem
      component={Link}
      active={!!match}
      to={to}
      primaryText={label}
      leftIcon={leftIcon}
    />
  );
};

NavItemLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  icon: PropTypes.node,
};
export default NavItemLink;
