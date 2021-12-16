import ajax from "./base";
import { baseURL } from "../config/values";

export async function getTrucks() {
    const tableName = "trucks";
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
    const tableName = 'trucks';
    const values = `'${null}','${data.truckInfo}','${data.truckPlate}','${0}','${data.truckNumber}','${data.truckType}'`;
    const truck = await ajax(
        `${baseURL}/insertValues`,
        {tableName,values},
        "post"
    );
    if (truck !==[]) return truck;
    else return 0;
}

export async function changeAvailable(data) {
  const tableName = 'trucks';
  const columnsAndValues = `Available = '${data.available}'`
  const condition = `TruckID = '${data.id}'`;
  const change = await ajax(
    `${baseURL}/updateValues`,
    {tableName, columnsAndValues, condition},
    "post"
  );
  if(change !==[]) return change;
  else return 0;
}

export async function deleteTruckID(data) {
  const tableName ='trucks';
  const condition = `TruckID = '${data.id}'`;
  const deleted = await ajax(
    `${baseURL}/deleteValues`,
    {tableName, condition},
    "post"
  );
  if(deleted !==[]) return deleted;
  else return 0;
}

export async function getTrucksByType(term){
  const tableName = "trucks";
  const condition = `TruckType = '${term}'`
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