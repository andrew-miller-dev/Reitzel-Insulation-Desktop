import { Route, Switch,  Link, useRouteMatch, useHistory } from "react-router-dom";
import React from "react";
import OrderList from "../orders/orderList";
import NewOrder from "./newOrder";
import { Button, Space } from "antd";
import "./index.css";

export default function Orders() {
  let { path, url } = useRouteMatch();
  let history = useHistory();
  
  return (
    <div style={{padding: "10px", margin: "10px"}}>
      <div>
        <h2> Orders<Space style={{float:"right"}}><Link to="/quotes/quoteList" ><Button>View All Work Orders</Button></Link>  <Link to="/quotes"><Button> New Work Order</Button></Link></Space></h2>
      </div> 
      <hr/>
      <Switch>
        <Route exact path={path} >
          
          </Route>
        <Route path="/orders/:oid/new" >
          <NewOrder />
        </Route>
        <Route path="/orders/:oid/edit" >
          
        </Route>
        <Route path="/orders/orderList">
          <OrderList/>
        </Route>
      </Switch>
      </div>
  );
}
