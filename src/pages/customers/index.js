import React from "react";
import "./index.css";
import { withRouter, useRouteMatch, Switch, Route } from "react-router-dom";
import CustomerList from "./custList";
import { CustomerInfo } from "./custInfo";

function Customers(props) {
  let { path, url } = useRouteMatch();

  return (
    <div style={{padding: "10px", margin: "10px"}}>
      <div>
        <h2>Customers</h2>
      </div>
      <hr/>
      <Switch>
        <Route exact path={path}>
          <CustomerList />
        </Route>
        <Route path="/customers/:qid">
          <CustomerInfo />
        </Route>
      </Switch>
    </div>
    
  );
}
export default withRouter(Customers);
