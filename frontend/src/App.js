// Sanket Naliyadra --> server.js / EmployeeCreate.js

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ApolloConsumer } from "@apollo/client";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeCreate from "./components/EmployeeCreate";
import EmployeeEdit from "./components/EmployeeEdit";
import EmployeeRetirement from "./components/EmployeeRetirement";
import Home from "./components/Home";
import EmployeeUpcomingRetirementComponent from "./components/EmployeeUpComingRetirenment";

class App extends Component {
  render() {
    return (
      <>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />}/>
            <Route
              path="/table"
              element={
                <ApolloConsumer>
                  {(client) => {
                    return <EmployeeTable client={client} />;
                  }}
                </ApolloConsumer>
              }
            />
            <Route
              path="/create"
              element={
                <ApolloConsumer>
                  {(client) => {
                    return <EmployeeCreate client={client} />;
                  }}
                </ApolloConsumer>
              }
            />
            <Route
              path="/retireEmployee"
              element={
                <ApolloConsumer>
                  {(client) => {
                    return <EmployeeRetirement client={client} />;
                  }}
                </ApolloConsumer>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ApolloConsumer>
                  {(client) => {
                    return <EmployeeEdit client={client} />;
                  }}
                </ApolloConsumer>
              }
            />
            <Route
              path="/upcomingRetirenment"
              element={
                <ApolloConsumer>
                  {(client) => {
                    return <EmployeeUpcomingRetirementComponent client={client} />;
                  }}
                </ApolloConsumer>
              }
            />
      </Routes >
      </>
    );
  }
}

export default App;
