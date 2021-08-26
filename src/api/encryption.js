import ajax from "./base";

const baseURL = "https://reitzel-server.herokuapp.com";

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

