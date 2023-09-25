import { checkExisting } from "../api/customer";
import { holidays } from "../util/storedArrays";


export function addEscapeChar(string) {
    let newstring = string;
    if(string.includes("'")) {
        newstring = string.replaceAll("'","\\'");
    }
    else if (string.includes('"')){
        newstring = newstring.replaceAll('"','\\"');
    }
    return newstring;
}


export async function CheckForExisting(data) {
    let obj = {
        firstName:data.CustFirstName,
        lastName:data.CustLastName,
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
    if(count > 1 || count <= 0) return true;
    else return false;
}

export function checkForWeekend (date) {
    const day = date.getDay();
    return day === 0 || day === 6
}

export function isValidDate(date) {
    let stringDate = date.toLocaleDateString();
    let filteredHolidays = holidays.filter((holiday) => new Date(holiday).toLocaleDateString() === stringDate).length > 0;
    if(filteredHolidays === false) 
    {
        
        if(checkForWeekend(date)) {
            return false
        }
        else return true;

    }
    else return false;
}