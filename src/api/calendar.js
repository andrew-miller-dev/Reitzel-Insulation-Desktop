import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";
const {format} = require('date-fns-tz');
let date = new Date();

//Estimate Calendar APIs
//
//
export async function getEstimates() {
    var tableName = "estimates";
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
    var tableName = "estimates";
    var condition = `EstimateID='${id}'`;
    const result = await ajax(`${baseURL}/deleteValues`, { tableName, condition }, "post");
    console.log("result", result);
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function getUsers() {
    var tableName = "users";
    var condition = "SecurityLevel = 'salesman'"
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
    var tableName = "estimates";
    var columnsAndValues = `startDate='${values.startDate}',endDate='${values.endDate}', UserID='${values.UserID}'`;
    var condition = `EstimateID='${id}'`;
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
    var tableName = "estimates";
    var columnsAndValues = `EstimateInfo = '${value}'`;
    var condition = `EstimateID='${id}'`;
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
    var tableName = "region";
    var condition = `RegionID = '${id}'`
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }
  export async function getRegionAPI(){
    var tableName = "region";
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }

  export async function sendConfirm(customer, email){
    var to = customer;
    var subject = "Booking Confirmation - Rietzel Insulation";
    var html = email;

    var completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html}, "post");
    if (completed !== []) return completed;
    else return 0;
 }

 export async function sendUpdate(customer, email, attach){
  var to = customer;
  var subject = "Booking Update - Reitzel Insulation";
  var html = email;
  var file = attach;

  var completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html, file}, "post");
  if (completed !== []) return completed;
  else return 0;
}

export async function findCustomer(id){
  var tableName = "customers";
  var condition = `CustomerID ='${id}'`
  var customer = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if (customer !== []) return customer;
  else return 0;
}

export async function getEstimateByIDToday(id) {
  var tableName = "estimates";
  var condition = `UserID = '${id}' AND startDate <= CURDATE() + INTERVAL 1 DAY`;
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
  var tableName = "estimates";
  var condition = `UserID = '${id}' AND startDate <= CURDATE() + INTERVAL 2 DAY`;
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


export async function addNewCustomer(values) {
  var tableName = "customers";
  var values = `${null},'${values.firstName}','${values.lastName}','${values.phone}','${values.email}','${values.siteAddress}','${values.siteCity}','${values.sitePostal}','${values.Region}'`;
  var orders = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (orders !== []) return orders;
  else {
    return 0;
  }
}

export async function getLatestCustomer() {
  let sql = `SELECT * FROM customers ORDER BY CustomerID DESC LIMIT 1`
  const customer = await ajax(
    `${baseURL}/processCustomQuery`,
    {sql},
    "post"
  );
  if (customer !== []) return customer;
  else{
    return 0;
  }
}

export async function getLatestAddress() {
  let sql = `SELECT * FROM address ORDER BY AddressID DESC LIMIT 1`
  const address = await ajax(
    `${baseURL}/processCustomQuery`,
    {sql},
    "post"
  );
  if (address !== []) return address;
  else{
    return 0;
  }
}

export async function addNewAddress(id, value){
  var tableName = "address";
  var values = `${null},'${id}','${value.siteAddress}','${value.sitePostal}','${value.siteCity}','${value.siteProv}','${value.siteRegion}'`;

  var address = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (address !== []) return address;
  else {
    return 0;
  }
}

export async function addEstimate(id, address, value) {
  var tableName = "estimates";
  var values = `${null},'${id}','${address}','${value.UserID}','${value.jobType}','${format(new Date(),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}','${value.apptInfo}','${value.siteRegion}','${value.startDate}','${value.endDate}'`;

  var estimate = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  if (estimate !== []) return estimate;
  else {
    return 0;
  }
}

export async function getCustomers() {
  var tableName = 'customers';

  var customers = await ajax (
    `${baseURL}/fetchValues`,
    {tableName},
    "post"
  );
  if(customers !== []) return customers;
  else return 0;
}

export async function getAddressList(id) {
  var tableName = "Address";
  var condition = `CustomerID = '${id}'`
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

export async function getWorkOrders() {
  var tableName = "workorders";
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
