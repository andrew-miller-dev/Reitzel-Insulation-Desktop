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