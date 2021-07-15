import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";


export async function getEstimates() {
    var tableName = "estimates";
    const estimatelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName},
      "post"
    );
    if (estimatelist !== []) return estimatelist;
    else {
      return 0;
    }
  }

export async function deleteEstimate(id) {
    var tableName = "estimates";
    var condition = `EstimateID='${id}'`;
    const result = await ajax(`${baseURL}/deleteValues`, { tableName, condition }, "post");
    console.log("result", result);
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function getUsers() {
    var tableName = "users";
    var condition = "SecurityLevel = 'salesman'"
    const userlist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (userlist !== []) return userlist;
    else {
      return 0;
    }
  }
  export async function updateEstimate(id, values) {
    console.log(id, values.startDate, values.endDate);
    var tableName = "estimates";
    var columnsAndValues = `startDate='${values.startDate}',endDate='${values.endDate}', UserID='${values.UserID}'`;
    var condition = `EstimateID='${id}'`;
    const result = await ajax(
      `${baseURL}/updateValues`,
      { tableName, columnsAndValues, condition },
      "post"
    );
    console.log("result", result);
    if (result !== []) return result;
    else {
      return 0;
    }
  }

  export async function getRegion(id){
    var tableName = "region";
    var condition = `RegionID = '${id}'`
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName, condition},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }
  export async function getRegionAPI(){
    var tableName = "region";
    const region = await ajax(
      `${baseURL}/fetchValues`,
      {tableName},
      "post"
    );
    if(region !== []) return region;
    else return 0;
  }

  export async function sendConfirm(customer, email){
    var to = customer;
    var subject = "Booking Confirmation - Rietzel Insulation";
    var html = email;

    var completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html}, "post");
    if (completed !== []) return completed;
    else return 0;
 }

 export async function sendUpdate(customer, email){
  var to = customer;
  var subject = "Booking Update - Reitzel Insulation";
  var html = email;

  var completed = await ajax(`${baseURL}/sendEmailHtml`, {to, subject, html}, "post");
  if (completed !== []) return completed;
  else return 0;
}

export async function findCustomer(id){
  var tableName = "customers";
  var condition = `CustomerID ='${id}'`
  var customer = await ajax(
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if (customer !== []) return customer;
  else return 0;
}

export async function getEstimateByID(id) {
  var tableName = "estimates";
  var condition = `UserID = '${id}'`;
    const estimatelist = await ajax(
      `${baseURL}/fetchValues`,
      { tableName, condition},
      "post"
    );
    if (estimatelist !== []) return estimatelist;
    else {
      return 0;
    }
}