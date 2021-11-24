import ajax from "./base";
const baseURL = "https://reitzel-server.herokuapp.com";

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

export async function getAvailableTrucks() {
    var tableName = "trucks";
    var condition = `Available = '1'`
    const trucklist = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
    if (trucklist !== []) return trucklist;
    else {
      return 0;
    }
}

export async function addNewOrder(value, trucktype) {
    var tableName = 'workorders';
    var values = `${null},'${value.allInfo.CustomerID}','${value.allInfo.AddressID}','${value.selectedTruck}','${value.allInfo.UserID}','${trucktype}','${value.total}','${value.startDate}','${value.endDate}'`;
    var newOrder = await ajax(
        `${baseURL}/insertValues`,
        {tableName, values},
        "post"
    );
    if (newOrder !== []) return newOrder;
    else return 0;
}

export async function addNewOrderDetail(value, order) {
    var tableName = 'workorderdetail';
    var values = `${null},'${order}','${value.id}','${value.details}','${value.total}'`;
    var newDetail = await ajax(
        `${baseURL}/insertValues`,
        {tableName, values},
        "post"
    );
    if (newDetail !== []) return newDetail;
    else return 0;
}

export async function addNewOrderProduct(value, order, detail) {
    var tableName = 'workorderprod';
    var values = `${null},'${order}','${detail}','${value.id}','${value.product}','${value.notes}','${value.price}'`;
    var newProd = await ajax(
        `${baseURL}/insertValues`,
        {tableName, values},
        "post"
    );
    if (newProd !== []) return newProd;
    else return 0;
}

export async function updateQuoteOnComplete(value) {
    var tableName = 'quotes';
    var columnsAndValues  = `completed = '${new Date()}'`;
    var condition = `QuoteID = '${value.allInfo.QuoteID}'`;
    var updated = await ajax(
        `${baseURL}/updateValues`,
        {tableName, columnsAndValues, condition},
        "post"
    );
    if (updated !== []) return updated;
    else return 0;
}