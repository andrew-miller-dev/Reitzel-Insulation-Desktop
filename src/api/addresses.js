import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";


export async function getAddress(id) {
    var tableName = "Address";
    var condition = `AddressID = '${id}'`
    const address = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    console.log("address", address);
    if (address !== []) return address;
    else {
      return 0;
    }
  }
  export async function getQuotes(id) {
    var tableName = "quotes";
    var condition = `AddressID = '${id}'`
    const quotelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    console.log("quotes ", quotelist);
    if (quotelist !== []) return quotelist;
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
  
  export async function getUser(){
    var tableName = "users";
    const user = await ajax(
      `${baseURL}/fetchValues`,
      {tableName},
      "post"
    );
    if(user !== []) return user;
    else return 0;
  }