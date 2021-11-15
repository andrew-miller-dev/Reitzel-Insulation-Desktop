import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";

export async function getTrucks() {
    var tableName = "trucks";
    const trucklist = await ajax(
      `${baseURL}/fetchValues`,
      {tableName},
      "post"
    );
    if (trucklist !== []) return trucklist;
    else {
      return 0;
    }
}

export async function addTruck(data) {
    var tableName = 'trucks';
    var values = `'${null}','${data.truckInfo}','${data.truckPlate}','${0}','${data.truckNumber}','${data.truckType}'`;
    const truck = await ajax(
        `${baseURL}/insertValues`,
        {tableName,values},
        "post"
    );
    if (truck !==[]) return truck;
    else return 0;
}

export async function changeAvailable(data) {
  var tableName = 'trucks';
  var columnsAndValues = `Available = '${data.available}'`
  var condition = `TruckID = '${data.id}'`;
  const change = await ajax(
    `${baseURL}/updateValues`,
    {tableName, columnsAndValues, condition},
    "post"
  );
  if(change !==[]) return change;
  else return 0;
}

export async function deleteTruckID(data) {
  var tableName ='trucks';
  var condition = `TruckID = '${data.id}'`;
  const deleted = await ajax(
    `${baseURL}/deleteValues`,
    {tableName, condition},
    "post"
  );
  if(deleted !==[]) return deleted;
  else return 0;
}