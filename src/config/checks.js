import { checkExisting } from "../api/customer";

export function checkForUndefined(object) {
    for (let[key, value] of Object.entries(object)){
        if (value === undefined) {
            value  = '_______';
        }
        console.log(`${key}, ${value}`)
    }
    console.log(object);
    return object;
}

export function addEscapeChar(string) {
    let newstring = string.replace("'","''");
    //newstring = newstring.replace('"','"');
    console.log(newstring);
    return newstring;
}


export async function CheckForExisting(data) {
    let obj = {
        firstName:data.FirstName,
        lastName:data.LastName,
        address:data.BillingAddress
    }
    const check = await checkExisting(obj);
    return check.data;
}

export function checkForMultipleBilling(array) {
    let count = 0;
    array.forEach((item) => {
       if(item.billing) count += 1; 
    });
    if(count > 1) return true;
    else return false;
}