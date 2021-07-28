import { Route, Switch,  Link, useRouteMatch, useHistory } from "react-router-dom";
import React, {useState} from "react";
import OrderList from "../orders/orderList";
import NewOrder from "./newOrder";
import OrderPreview from './orderPreview';
import { Button, Space } from "antd";
import "./index.css";

export default function Orders() {
  let { path, url } = useRouteMatch();
  let history = useHistory();

 const [orderData, setOrderData] = useState({});

 function updateOrderData(values) {
  if (!(values == null || values  == "" || values == undefined)) {
    setOrderData(values);
    history.push(`${url}/preview`);
}else{
    setOrderData({});
}
 } 
  
  return (
    <div style={{padding: "10px", margin: "10px"}}>
      <div>
        <h2> Orders<Space style={{float:"right"}}><Link to="/orders/orderList" ><Button>View All Work Orders</Button></Link>  <Link to="/quotes"><Button> New Work Order</Button></Link></Space></h2>
      </div> 
      <hr/>
      <Switch>
        <Route exact path={path} >
          
          </Route>
        <Route path="/orders/:oid/new" >
          <NewOrder updateOrder = {updateOrderData} />
        </Route>
        <Route path="/orders/:oid/edit" >

        </Route>
        <Route path="/orders/orderList">
          <OrderList/>
        </Route>
        <Route path='/orders/preview'>
          <OrderPreview orderInfo = {orderData} />
        </Route>
      </Switch>
      </div>
  );
}
