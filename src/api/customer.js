import ajax from "./base";
import { baseURL } from "../config/values";
import { addEscapeChar } from "../config/checks";

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();



  export async function getAddresses() {
    console.log("here");
    var tableName = "Addresses";
    const addresslist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName},
      "post"
    );
    console.log("addresslist", addresslist);
    if (addresslist !== []) return addresslist;
    else {
      return 0;
    }
  }

  export async function getCustomer(id){
    var tableName = "customers";
    var condition = `CustomerID = '${id}'`
    const customer = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
      if(customer !== []) return customer;
      else return 0;

    }
  export async function getCustomerAddresses(id){
    var tableName = "address";
    var condition = `CustomerID = '${id}'`
    const addressList = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
    if(addressList !== []) return addressList;
    else return 0;
  }

  export async function updateCustomer(id, firstName, lastName, email, phone, billing, city, postal, region, contractor){
    var tableName = "customers";
    var columnsAndValues = `CustFirstName='${firstName}', CustLastName='${lastName}',Phone='${phone}',Email='${email}', BillingAddress='${addEscapeChar(billing)}',CustCity='${city}',CustPostalCode='${postal}', CustRegion='${region}',IsContractor='${contractor}'`;
  var condition = `CustomerID=${id}`;
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

export async function updateAddress(id, values) {
  const tableName = 'address';
  const columnsAndValues = `Address='${addEscapeChar(values.address)}',PostalCode='${values.postalCode}',City='${values.city}',Region='${values.region.value}',ContractorName='${values.contractorName}',ContractorPhone='${values.contractorPhone}'`;
  const condition = `AddressID=${id}`;
  const result = await ajax(
    `${baseURL}/updateValues`,
    {tableName,columnsAndValues,condition},
    "post"
  );
return result;
}

export async function deleteCustomer(id) {
  var tableName = "customers";
  var columns = "*";
  var condition = `CustomerID='${id}'`;
  const result = await ajax(`${baseURL}/deleteValues`, { tableName, columns, condition }, "post");
  console.log("result", result);
  if (result !== []) return result;
  else {
    return 0;
  }
}

export async function customerLookup(value){
  var tableName = "customers";
  var condition = `CustFirstName LIKE '%${value}%' OR CustLastName LIKE '%${value}%' OR BillingAddress LIKE '%${value}%'`;
  const customers = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if(customers !== []) return customers;
  else return 0;
}

export async function addNotes(value, user, id){
  var tableName = "customernotes";
  var values = `${null},'${value}','${date}','${user}','${id}'`;
  const notes = await ajax(
    `${baseURL}/insertValues`,
    {tableName, values},
    "post"
  );
  if(notes !== []) return notes;
  else return 0;
}

export async function getNotes(id){
  var tableName = "customernotes";
  var condition = `CustomerID = '${id}'`;
  const notes = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post");
    if(notes !== []) return notes;
    else return 0;
}

export async function deleteNote(id){
  var tableName = "customernotes";
  var condition = `CustNotesID = '${id}'`;
  const notes = await ajax(
    `${baseURL}/deleteValues`,
    {tableName, condition},
    "post");
    if(notes !== []) return notes;
    else return 0;
}

export async function checkExisting(info){
  const tableName = "customers";
  const condition = `CustFirstName = '${info.firstName}' AND CustLastName = '${info.lastName}' AND BillingAddress = '${info.address}'`;
  const check = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post");
    return check;
}

export async function getCustomerQuotes(id) {
  const tableName = "quotes LEFT JOIN subtotallines ON quotes.QuoteID = subtotallines.quoteID LEFT JOIN quotelines ON quotes.QuoteID = quotelines.QuoteID";
  const condition = `CustomerID = '${id}'`;
  const quotes = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post");
    return quotes;
}
