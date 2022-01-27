import React from "react";
import Template from './Template.js'
import SalesmanTemplate from "./SalesmanTemplate.js";
import { getMenu, getUser } from "../../util/storage.js";

export default function Home(props) {
  let user = getUser();
  if(getUser() && getMenu()){
    if(user.SecurityLevel === "admin")
  return <Template />;
  else if(user.SecurityLevel === "salesman")
  return <SalesmanTemplate />;
  }
  else return (
  <div>
    Loading...
  </div>
  )
  
}
