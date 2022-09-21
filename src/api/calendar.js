import ajax from "./base";
import { baseURL } from "../config/values";

const {format, zonedTimeToUtc} = require('date-fns-tz');
const date = new Date()
const utcDate = format(zonedTimeToUtc(date, 'America/Toronto'),"yyyy-MM-dd");

//Estimate Calendar APIs
//
//
export async function getEstimates() {
    const tableName = "estimates";
    const estimatelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName},
      "post"
    );
    if (estimatelist !== []) return estimatelist;
    else {
      return 0;
    }
  }

export async function deleteEstimate(id) {
    const tableName = "estimates";
    const condition = `EstimateID='${id}'`;
    const result = await ajax(`${baseURL}/deleteValues`, { tableName, condition }, "post");
    console.log("result", result);
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function getUsers() {
    const tableName = "users";
    const condition = "SecurityLevel = 'salesman'"
    const userlist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (userlist !== []) return userlist;
    else {
      return 0;
    }
  }
  
  export async function getUsersWithDisplay() {
    const tableName = "users";
    const condition = "SecurityLevel = 'salesman' AND Display = '1'"
    const userlist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (userlist !== []) return userlist;
    else {
      return 0;
    }
  }
  export async function updateEstimate(id, values) {
    const tableName = "estimates";
    const columnsAndValues = `startDate='${values.startDate}',endDate='${values.endDate}', UserID='${values.UserID}'`;
    const condition = `EstimateID='${id}'`;
    const result = await ajax(
      `${baseURL}/updateValues`,
      { tableName, columnsAndValues, condition },
      "post"
    );
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function updateEstimateInfo(id, value) {
    const tableName = "estimates";
    const columnsAndValues = `EstimateInfo = '${value}'`;
    const condition = `EstimateID='${id}'`;
    const result = await ajax(
      `${baseURL}/updateValues`,
      { tableName, columnsAndValues, condition },
      "post"
    );
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function getRegion(id){
    const tableName = "region";
    const condition = `RegionID = '${id}'`
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }
  export async function getRegionAPI(){
    const tableName = "region";
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }

  export async function sendConfirm(customer, email){
    const to = customer;
    const subject = "Booking Confirmation - Reitzel Insulation";
    const html = email;

    const completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html}, "post");
    if (completed !== []) return completed;
    else return 0;
 }

 export async function sendUpdate(customer, email, attach){
  const to = customer;
  const subject = "Booking Update - Reitzel Insulation";
  const html = email;
  const file = attach;

  const completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html, file}, "post");
  if (completed !== []) return completed;
  else return 0;
}

export async function getEstimateByIDToday(id) {
  const tableName = "estimates";
  const condition = `UserID = '${id}' AND startDate <= CURDATE() + INTERVAL 1 DAY`;
    const estimatelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (estimatelist !== []) return estimatelist;
    else {
      return 0;
    }
}

export async function getEstimateByIDTomorrow(id) {
  const tableName = "estimates";
  const condition = `UserID = '${id}' AND startDate <= CURDATE() + INTERVAL 2 DAY`;
    const estimatelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (estimatelist !== []) return estimatelist;
    else {
      return 0;
    }
}


export async function addNewCustomer(value) {
  const tableName = "customers";
  const values = `${null},'${value.firstName}','${value.lastName}','${value.phone}','${value.email}','${value.siteAddress}','${value.siteCity}','${value.sitePostal}','${value.Region}'`;
  const orders = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (orders !== []) return orders;
  else {
    return 0;
  }
}

export async function addNewAddress(id, value){
  const tableName = "address";
  const values = `${null},'${id}','${value.siteAddress}','${value.sitePostal}','${value.siteCity}','${value.siteRegion}'`;

  const address = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (address !== []) return address;
  else {
    return 0;
  }
}

export async function addEstimate(id, address, value) {
  const tableName = "estimates";
  const values = `${null},'${id}','${address}','${value.UserID}','${value.JobType}','${utcDate}','${value.estimateInfo}','${value.siteRegion}','${value.startDate}','${value.endDate}'`;

  const estimate = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (estimate !== []) return estimate;
  else {
    return 0;
  }
}

export async function getCustomers() {
  const tableName = 'customers';

  const customers = await ajax (
    `${baseURL}/fetchValues`,
    {tableName},
    "post"
  );
  if(customers !== []) return customers;
  else return 0;
}

export async function getAddressList(id) {
  const tableName = "Address";
  const condition = `CustomerID = '${id}'`
  const address = await ajax(
    `${baseURL}/fetchValues`,
    { tableName, condition},
    "post"
  );
  if (address !== []) return address;
  else {
    return 0;
  }
}

//
//
//
// Calendar Fill Truck APIs
//
//

export async function getWorkOrderType(term) {
  const tableName = "workorders";
  const condition = `WorkType = '${term}'`
  const estimatelist = await ajax(
    `${baseURL}/fetchValues`,
    { tableName, condition},
    "post"
  );
  if (estimatelist !== []) return estimatelist;
  else {
    return 0;
  }
}

export async function getDetailsByID(id) {
  const tableName = 'workorderdetail';
  const condition = `OrderID = '${id}'`;
  const detArr = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if(detArr !== []) return detArr;
  else return 0;
}

export async function getProductsByID(id) {
  const tableName = 'workorderprod';
  const condition = `WODetailID = '${id}'`;
  const detArr = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if(detArr !== []) return detArr;
  else return 0;
}

export async function updateWorkOrder(id, values) {
  const tableName = "workorders";
  const columnsAndValues = `startDate='${values.startDate}',endDate='${values.endDate}', TruckID='${values.TruckID}'`;
  const condition = `WorkOrderID='${id}'`;
  const result = await ajax(
    `${baseURL}/updateValues`,
    { tableName, columnsAndValues, condition },
    "post"
  );
  if (result !== []) return result;
  else {
    return 0;
  }
}

export async function deleteWorkOrder(id){
    const tableName = "workorders";
    const condition = `WorkOrderID='${id}'`;
    const result = await ajax(`${baseURL}/deleteValues`, { tableName, condition }, "post");
    if (result !== []) return result;
    else {
      return 0;
    }
}

export async function getCustomerQuotes(id) {
  const tableName = 'quotes';
  const condition = `CustomerID ='${id}' AND completed IS NULL`
  const result = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if (result !== []) return result;
  else return 0;
}

export async function getQuoteDetails(id) {
  const tableName = 'subtotallines';
  const condition = `quoteID = '${id}'`;
  const result = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  return result;
}

export async function getQuoteProducts(id) {
  const tableName = 'quotelines';
  const condition = `QuoteID = '${id}'`;
  const result = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  return result;
}

export async function addNewOrder(info){
  const tableName = 'workorders';
  const values = `${null},'${info.QuoteID}','${info.CustomerID}','${info.AddressID}','${info.TruckID}','${info.UserID}','${info.WorkType}','${info.total}','${info.startDate}','${info.endDate}','${utcDate}'`;
  
  const result = await ajax(
    `${baseURL}/insertValues`,
    {tableName, values},
    "post"
  );
  return result;
}

export async function markQuoteComplete(value) {
  var tableName = 'quotes';
  var columnsAndValues  = `completed = '${utcDate}'`;
  var condition = `QuoteID = '${value.QuoteID}'`;
  var updated = await ajax(
      `${baseURL}/updateValues`,
      {tableName, columnsAndValues, condition},
      "post"
  );
  if (updated !== []) return updated;
  else return 0;
}

export async function sendEmail(customer, email, title, attach){
  const to = customer;
  const subject = title;
  const html = email;
  const file = attach

  const completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html, file}, "post");
  if (completed !== []) return completed;
  else return 0;
}
