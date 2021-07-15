import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";
const {format} = require('date-fns-tz');

export async function addOrder(order) {
  var tableName = "customers";
  var values = `${null},'${order.FirstName}','${order.LastName}','${order.Phone}','${order.Email}','${order.BillingAddress}','${order.City}','${order.PostalCode}','${order.Region}'`;

  var orders = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  console.log("cusotmers", orders);
  if (orders !== []) return orders;
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

export async function getEstimates() {
  var tableName = "estimates";
  var columns = "*";
  var condition = ``;
  const user = await ajax(
    `${baseURL}/fetchValues`,
    { tableName, columns, condition },
    "post"
  );
  console.log("user", user);
  if (user !== []) return user;
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