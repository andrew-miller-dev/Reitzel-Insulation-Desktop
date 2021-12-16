import ajax from "./base";
import { baseURL } from "../config/values";

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();


export async function getQuoteDetails(id){
    const tableName = "subtotallines";
    const condition = `quoteID = '${id}'`;
    const detaillist = await ajax (
        `${baseURL}/fetchValues`,
        {tableName, condition},
        "post"
    );
    if(detaillist !== []) return detaillist;
    else return 0;
}

export async function getProductList(id){
    const tableName = "quotelines";
    const condition = `QuoteID = '${id}'`;
    const productlist = await ajax(
        `${baseURL}/fetchValues`,
        {tableName, condition},
        "post"
    );
    if(productlist !== []) return productlist;
    else return 0;
}

export async function getUserID(id){
    const tableName = 'users';
    const condition = `UserID = '${id}'`;
    const userinfo = await ajax (
        `${baseURL}/fetchValues`,
        {tableName, condition},
        "post"
    );
    if(userinfo !== []) return userinfo;
    else return 0;
}

export async function getQuoteID(id){
    const tableName = 'quotes';
    const condition = `QuoteID = ${id}`;
    const quoteData = await ajax(
        `${baseURL}/fetchValues`,
        {tableName, condition},
        "post"
    );
    if(quoteData !== []) return quoteData;
    else return 0;
}

export async function updateQuote(values){
    const tableName = 'quotes';
    const columnsAndValues = `QuoteTotal = '${values.total}', notesCustomers = '${values.customer_notes}', notesInstallers = '${values.installer_notes}', modifyDate = '${(date)}'`;
    const condition = `QuoteID = '${values.id}'`;
    const quoteUpdate = await ajax(
        `${baseURL}/updateValues`,
        {tableName, columnsAndValues, condition},
        "post"
    );
    if(quoteUpdate !== []) return quoteUpdate;
    else return 0;
}

export async function updateDetail(values){
    const tableName = 'subtotallines';
    const columnsAndValues = `subtotalLines = '${values.details}', subtotalAmount = '${values.total}'`;
    const condition = `subtotalID = '${values.id}'`;
    const detailUpdate = await ajax(
        `${baseURL}/updateValues`,
        {tableName, columnsAndValues, condition},
        "post"
    );
    if(detailUpdate !== []) return detailUpdate;
    else return 0;
}

export async function updateProduct(values){
    const tableName = 'quotelines';
    const columnsAndValues = `Product = '${values.product}', Notes = '${values.notes}', Subtotal='${values.price}'`;
    const condition = `QuoteLineID = '${values.id}'`;
    const productUpdate = await ajax(
        `${baseURL}/updateValues`,
        {tableName, columnsAndValues, condition},
        "post"
    );
    console.log('update',productUpdate);
    if(productUpdate !== []) return productUpdate;
    else return 0;
}

export async function getAllInfo(){
    const sql = `SELECT * FROM quotes LEFT JOIN address ON quotes.AddressID = address.AddressID LEFT JOIN users ON quotes.UserID = users.UserID LEFT JOIN customers ON quotes.CustomerID = customers.CustomerID
    `;
    const info = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(info !== []) return info;
    else return 0; 
}

export async function getAllInfoID(id){
    const sql = `SELECT * FROM quotes LEFT JOIN address ON quotes.AddressID = address.AddressID LEFT JOIN users ON quotes.UserID = users.UserID LEFT JOIN customers ON quotes.CustomerID = customers.CustomerID WHERE quotes.QuoteID = '${id}'
    `;
    const info = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(info !== []) return info;
    else return 0; 
}

export async function getDetails(){
    const sql = `SELECT * FROM subtotallines`;
    const details = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(details !== []) return details;
    else return 0;
}

export async function getProducts(){
    const sql = `SELECT * FROM quotelines`;
    const prods = await ajax (
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(prods !== []) return prods;
    else return 0;
}

export async function SearchAllInfo(value) {
    const sql = `SELECT * FROM quotes LEFT JOIN address ON quotes.AddressID = address.AddressID LEFT JOIN users ON quotes.UserID = users.UserID LEFT JOIN customers ON quotes.CustomerID = customers.CustomerID 
    WHERE CustFirstName LIKE '%${value}%' OR CustLastName LIKE '%${value}%' OR Address LIKE '%${value}%'`;
    const info = await ajax(
        `${baseURL}/processCustomQuery`,
        {sql},
        "post"
    );
    if(info !== []) return info;
    else return 0; 
}

export async function deleteProduct(id) {
    const tableName = 'quotelines';
    const condition = `QuoteLineID = '${id}'`;
    const confirm = await ajax(
        `${baseURL}/deleteValues`,
        {tableName, condition},
        "post"
    );
    if(confirm !== []) return confirm;
    else return 0;
}

export async function deleteDetail(id) {
    const tableName = 'subtotallines';
    const condition = `subtotalID = '${id}'`;
    const confirm = await ajax(
        `${baseURL}/deleteValues`,
        {tableName, condition},
        "post"
    );
    if(confirm !== []) return confirm;
    else return 0;
}