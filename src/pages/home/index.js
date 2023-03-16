import React, { useEffect, useState } from "react";
import Template from './Template.js'
import SalesmanTemplate from "./SalesmanTemplate.js";
import { getMenu, getUser } from "../../util/storage.js";
import { getCustomers } from "../../api/calendar.js";

export default function Home(props) {

  useEffect(() => {
    let customers = async()=> {
      let list = await getCustomers();
      localStorage.setItem("customerList",JSON.stringify(list.data));
    }
    customers();
    
  })

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