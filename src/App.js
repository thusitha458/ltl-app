import React, {Component} from 'react';
import './App.css';
import Projects from './components/Projects';
import Login from './components/Login';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ProjectActionPlan from "./components/ProjectActionPlan";
import AddProject from "./components/AddProject";
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {BACKGROUND_IMAGES} from "./config/config";
import EditProject from './components/EditProject';

class App extends Component {
    state = {
        backgroundImage: BACKGROUND_IMAGES.LOGO,
    };

    handleRouteChange = imageId => {
        this.setState({backgroundImage: imageId});
    };

  render() {
      return (
          <Router>
              <div className={`App ${this.state.backgroundImage}`}>
                  <NotificationContainer/>
                  <Switch>
                      <Route exact path="/login" render={props => <Login onRouteChange={() => this.handleRouteChange(BACKGROUND_IMAGES.HOME)} {...props} />} />
                      <Route exact path="/" render={props => <Projects onRouteChange={() => this.handleRouteChange(BACKGROUND_IMAGES.HOME)} {...props}/>} />
                      <Route exact path="/project/:ct" render={props => <ProjectActionPlan onRouteChange={() => this.handleRouteChange(BACKGROUND_IMAGES.MACHINE)} {...props}/>} />
                      <Route exact path="/addProject" render={props => <AddProject onRouteChange={() => this.handleRouteChange(BACKGROUND_IMAGES.HOME)} {...props}/>} />
                      <Route exact path="/edit/:ct" render={props => <EditProject onRouteChange={() => this.handleRouteChange(BACKGROUND_IMAGES.HOME)} {...props}/>} />
                  </Switch>
              </div>
          </Router>
      );
  }
}

export default App;
