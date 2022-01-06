import React from "react";
import Template from './Template.js'
import SalesmanTemplate from "./SalesmanTemplate.js";
import { getUser } from "../../util/storage.js";

export default function Home(props) {
  let user = getUser();
  if(user.SecurityLevel === "admin")
  return <Template />;
  else if(user.SecurityLevel === "salesman")
  return <SalesmanTemplate />;
}
