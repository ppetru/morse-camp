import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavigationDrawer } from 'react-md';

import './App.css';
import NavItemLink from './NavItemLink';
import CopyTrainer from './CopyTrainer';
import Settings from './Settings';

const navItems = [{
  label: 'Home',
  to: '/',
  exact: true,
  icon: 'home',
}, {
  label: 'Settings',
  to: `/settings`,
  icon: 'settings',
}];

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Route
          render={({ location }) => (
            <NavigationDrawer
              drawerTitle="Morse Camp"
              toolbarTitle="Morse Camp"
              navItems={navItems.map(props => <NavItemLink {...props} key={props.to} />)}
            >
              <Switch key={location.key}>
                <Route path="/settings" location={location} component={Settings} />
                <Route location={location} render={() =>
                    <CopyTrainer />}
                />
              </Switch>
            </NavigationDrawer>
          )}
        />
      </Router>
    );
  }
}
export default App;
