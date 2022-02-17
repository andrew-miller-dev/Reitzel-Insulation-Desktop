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