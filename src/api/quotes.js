import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";
const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

export async function sendQuote(customer, email){
    var to = customer;
    var subject = "Your quote with Rietzel Insulation";
    var html = email;

    var completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html}, "post");
    if (completed !== []) return completed;
    else return 0;
 }

 
export async function getCustomers() {
    var tableName = "Customers";
    const customerlist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName},
      "post"
    );
    console.log("customerlist", customerlist);
    if (customerlist !== []) return customerlist;
    else {
      return 0;
    }
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

  export async function addNewDetails(values, id){
    var sql = `INSERT INTO subtotallines VALUES ('${null}','${id}','${values.details}','${values.total}')`
    var tableName = "subtotallines";
    var values = `'${null}','${id}','${values.details}','${values.total}'`;
    var details = await ajax(`${baseURL}/processCustomQuery`, {sql}, "post");
    if(details !== []) return details;
    else{
      return 0;
    }
  }

  export async function addNewProductLine(values, id, detailID){
    var tableName = "quotelines";
    var values = `'${null}','${detailID}', '${id}','${values.product}','${values.notes}', '${values.price}'`;
    var product = await ajax(`${baseURL}/insertValues`, {tableName, values }, "post");
    console.log(product);
    if(product !== []) return product;
    else{
      return 0;
    }
  }

  export async function getLatestQuote() {
    let sql = `SELECT * FROM quotes ORDER BY QuoteID DESC LIMIT 1`
    const quote = await ajax(
      `${baseURL}/processCustomQuery`,
      {sql},
      "post"
    );
    if (quote !== []) return quote;
    else{
      return 0;
    }
  }

  export async function getLatestDetail() {
    let sql = `SELECT * FROM subtotallines ORDER BY subtotalID DESC LIMIT 1`
    const quote = await ajax(
      `${baseURL}/processCustomQuery`,
      {sql},
      "post"
    );
    if (quote !== []) return quote;
    else{
      return 0;
    }
  }