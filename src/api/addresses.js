import ajax from "./base";
import { baseURL } from "../config/values";


export async function getAddress(id) {
    var tableName = "address";
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

  export async function getAddressByQuoteID(id) {
      const sql = `SELECT * FROM quotes LEFT JOIN address ON quotes.AddressID = address.AddressID WHERE quotes.QuoteID = '${id}'
      `;
      const info = await ajax(
          `${baseURL}/processCustomQuery`,
          {sql},
          "post"
      );
      if(info !== []) return info;
      else return 0; 
  }