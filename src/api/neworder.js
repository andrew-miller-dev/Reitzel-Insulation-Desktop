import ajax from "./base";
import { baseURL } from "../config/values";
const {format} = require('date-fns-tz');

export async function addCustomer(order) {
  var tableName = "customers";
  var values = `${null},'${order.FirstName}','${order.LastName}','${order.Phone}','${order.Email}','${order.BillingAddress}','${order.City}','${order.PostalCode}','${order.Region}'`;

  var customer = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (customer !== []) return customer;
  else {
    return 0;
  }
}

export async function addEstimate(id, address, value) {
  var tableName = "estimates";
  var values = `${null},'${id}','${address}','${value.UserID}','${value.JobType}','${format(new Date(),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}','${value.estimateInfo}','${value.Region}','${value.startDate}','${value.endDate}'`;

  var estimate = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (estimate !== []) return estimate;
  else {
    return 0;
  }
}

export async function addAddress(id, value){
  var tableName = "address";
  var values = `${null},'${id}','${value.BillingAddress}','${value.PostalCode}','${value.City}','${value.Prov}','${value.Region}'`;

  var address = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  console.log("address", address);
  if (address !== []) return address;
  else {
    return 0;
  }
}