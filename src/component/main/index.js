import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Home from "../../pages/home";
import Quotes from "../../pages/quotes";
import Orders from "../../pages/orders";
import Invoices from "../../pages/invoices";
import Customers from "../../pages/customers";
import Users from "../../pages/users";
import Roles from "../../pages/roles";
import CustomerInfo from "../../pages/customerInfo";
import AddressInfo from "../../pages/addressInfo";
import NewCusomter from "../../pages/newcustomer";
import NewEstimate from "../../pages/newestimate";
import "./index.css";
import QuoteEmail from "../../Components/Email_Templates/quote_template";
import QuoteEdit from '../../pages/quotes/quoteEdit';

const id = 0;
export default function Main() {
  return (
    <div className="content-main">
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/quotes" component={Quotes} />
        <Route path="/orders" component={Orders} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/customers" component={Customers} />
        <Route path="/users" component={Users} />
        <Route path="/roles" component={Roles} />
        <Route path="/customerinfo/:customer" component={CustomerInfo} />
        <Route path="/addressinfo/:address" component={AddressInfo} />
        <Route path="/newcustomer" component={NewCusomter} />
        <Route path="/newestimate" component={NewEstimate} />
        <Route path="/testquote" component={QuoteEmail} />
        <Route path="/quoteinfo/:qid" component={QuoteEdit} />
        <Redirect to="/home"></Redirect>
      </Switch>
    </div>
  );
}
