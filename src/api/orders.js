import ajax from "./base";
const baseURL = "https://reitzel-server.herokuapp.com";
const {format} = require('date-fns-tz');

export async function getAllInfoID(id){
    var sql = `SELECT * FROM quotes LEFT JOIN address ON quotes.AddressID = address.AddressID LEFT JOIN users ON quotes.UserID = users.UserID LEFT JOIN customers ON quotes.CustomerID = customers.CustomerID
    WHERE quotes.QuoteID = '${id}'
    `;
    const info = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(info !== []) return info;
    else return 0; 
}

export async function getDetailsID(id){
    var sql = `SELECT * FROM subtotallines WHERE QuoteID = '${id}'`;
    const details = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(details !== []) return details;
    else return 0;
}

export async function getProductsID(id){
    var sql = `SELECT * FROM quotelines WHERE QuoteID = '${id}'`;
    const prods = await ajax (
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(prods !== []) return prods;
    else return 0;
}