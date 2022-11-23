import { Route, Switch,  Link, useRouteMatch, useHistory } from "react-router-dom";
import React, {useState} from "react";
import OrderList from "../orders/orderList";
import NewOrder from "./newOrder";
import OrderPreview from './orderPreview';
import { Button, Space, Modal } from "antd";
import "./index.css";
import NewWorkOrderForm from "../../Components/Forms/newworkorderform";

export default function Orders() {
  let { path, url } = useRouteMatch();
  let history = useHistory();

 const [orderData, setOrderData] = useState({});
 const [formOption, setFormOption] = useState({});
 const [showForm, setShowForm] = useState(false);

function newOrder() {
  setFormOption(<NewWorkOrderForm truck={{id:null,name:null}} start={new Date()} />);
  setShowForm(true);
}

function closeForm(){
  setShowForm(false);
}

 function updateOrderData(values) {
  if (!(values == null || values  == "" || values == undefined)) {
    setOrderData(values);
    history.push(`/home`);
}else{
    setOrderData({});
}
 } 
  return (
    <div style={{padding: "10px", margin: "10px"}}>
      <div>
        <h2> Orders<Space style={{marginLeft:"25px"}}><Link to="/orders/orderList" ><Button>View All Work Orders</Button></Link><Link ><Button onClick={newOrder}>New Work Order</Button></Link></Space></h2>
      </div> 
      <hr/>
      <Switch>
        <Route exact path={path} >
        <OrderList/>
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
      <Modal 
        visible={showForm}
        onCancel={closeForm}
        width="75%"
        destroyOnClose={true}
        footer={false}
      >
        {formOption}
      </Modal>
      </div>
  );
}
