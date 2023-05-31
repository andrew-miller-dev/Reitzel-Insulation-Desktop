import ajax from "./base";
import { baseURL } from "../config/values";
const {format} = require('date-fns-tz');

export async function addCustomer(order) {
  var tableName = "customers";
  var values = `${null},'${order.CustFirstName}','${order.CustLastName}','${order.Phone}','${order.Email}','${order.BillingAddress}','${order.CustCity}','${order.CustPostalCode}','${order.CustRegion}','${order.IsContractor}'`;

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
  var values = `${null},'${id}','${value.BillingAddress}','${value.PostalCode}','${value.City}','${value.Region}','${null}','${null}'`;

  var address = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  console.log("address", address);
  if (address !== []) return address;
  else {
    return 0;
  }
}

export async function addContractAddress(id, value){
  var tableName = "address";
  var values = `${null},'${id}','${value.BillingAddress}','${value.PostalCode}','${value.City}','${value.Region}','${value.ContractorName}','${value.ContractorNumber}'`;

  var address = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  console.log("address", address);
  if (address !== []) return address;
  else {
    return 0;
  }
}