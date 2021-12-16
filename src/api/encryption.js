import ajax from "./base";
import { baseURL } from "../config/values";

export async function useEncrypt(value) {
    let data = value;
    let encryptedWord = await ajax(
        `${baseURL}/encrypt`,
        {data},
        "post"
    );
    if(encryptedWord !== []) return encryptedWord;
    else return 0;
}

