import ajax from "./base";
import { baseURL } from "../config/values";

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

export async function sendQuote(customer, email, attach){
    var to = customer;
    var subject = "Your quote with Reitzel Insulation";
    var html = email;
    var file = attach

    var completed = await ajax(`${baseURL}/sendEmailAttach`, {to, subject, html, file}, "post");
    if (completed !== []) return completed;
    else return 0;
 } 

  export async function getCustomerFiltered(filter){
    var tableName = "Customers";
    var condition = `FirstName = '${filter}%'`
    const customerlist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (customerlist !== []) return customerlist;
    else {
      return 0;
    }
  }

  export async function addNewQuote(value){
    var tableName = "quotes";
    var values = `'${null}','${value.addressID}','${value.id}','${value.userInfo.UserID}','${value.total}','${value.customer_notes}','${value.installer_notes}','${date}',${null},${null}`;
    var quote = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
    if (quote !== []) return quote;
    else {
      return 0;
    }
    }

  export async function addNewDetails(value, id){
    var tableName = "subtotallines";
    var values = `'${null}','${id}','${value.details}','${value.total}'`;
    var details = await ajax(`${baseURL}/insertValues`, {tableName, values}, "post");
    if(details !== []) return details;
    else{
      return 0;
    }
  }

  export async function addNewProductLine(value, id, detailID){
    var tableName = "quotelines";
    var values = `'${null}','${detailID}', '${id}','${value.product}', '${value.price}','${value.tax}'`;
    var product = await ajax(`${baseURL}/insertValues`, {tableName, values }, "post");
    if(product !== []) return product;
    else{
      return 0;
    }
  }

  export async function deleteQuote(id){
    var sql =`DELETE quotes, quotelines, subtotallines FROM quotes LEFT JOIN quotelines ON quotes.QuoteID= quotelines.QuoteID LEFT JOIN subtotallines ON quotes.QuoteID = subtotallines.QuoteID WHERE quotes.QuoteID = '${id}'`
    const result = await ajax(
      `${baseURL}/processCustomQuery`,
      {sql},
      'post'
    );
    return result;
  
  }