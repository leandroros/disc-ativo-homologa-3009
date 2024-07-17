import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {
  Login,
  CreateJob,
  JobList,
  MachineList,
  ResultArchive,
  LogArchive,
  FilterMD5,
  People,
  CreateDiscover,
  StatusDiscover,
  SettingsMachine,
  StatusByMachine,
  AccompanyDiscovery,
} from "../src/app/pages";
import Anonimizar from "./app/pages/Anonimizar";
import { isAuthenticated } from "./app/services/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => <Login />} />
      <PrivateRoute path="/create-job" component={() => <CreateJob />} />
      <PrivateRoute path="/create-discover" component={() => <CreateDiscover />} />
      <Route path="/job-list" component={() => <JobList />} />
      <Route path="/machine-list" component={() => <MachineList />} />
      <PrivateRoute path="/app" component={() => <h1>App</h1>} />
      <PrivateRoute path="/result-archive" component={() => <ResultArchive />} />
      <PrivateRoute path="/log-archive" component={() => <LogArchive />} />
      <PrivateRoute path="/md5" component={() => <FilterMD5 />} />
      <PrivateRoute path="/people" component={() => <People />} />
      <PrivateRoute path="/status" component={() => <StatusDiscover />} />
      <PrivateRoute path="/status-machine" component={() => <StatusByMachine />} />
      <PrivateRoute path="/anonimizar-dados" component={() => <Anonimizar />} />
      <PrivateRoute path="/settings" component={() => <SettingsMachine />} />
      <PrivateRoute path="/accompany-discovery" component={() => <AccompanyDiscovery />} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
