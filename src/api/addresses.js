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
    if (quotelist !== []) return quotelist;
    else {
      return 0;
    }
  }
