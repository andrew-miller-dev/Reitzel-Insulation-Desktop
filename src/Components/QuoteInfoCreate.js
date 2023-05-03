import { getProductList, getQuoteDetails, getQuoteID } from "../api/quoteEditAPI";

export default async function QuoteInfoCreate (id) {

let quoteData = {};
let detailData = {};
let prodData = {};

const getDetailsByID = (arr) => {

    let array = [];
    arr.forEach((item) => {
        array.push({
          quoteID:item.quoteID,
          id:item.SubtotalID,
          subtotalLines:item.subtotalLines,
          total:item.subtotalAmount,
          selected:false,
          arr:getProductArr(item.SubtotalID)
        });
    });
    return array;
}

const getProductArr = (id) => {
    let array = [];
    prodData.forEach((item) => {
           if(item.subtotalID === id){
                array.push({
                  prodID:item.QuoteLineID,
                  product:item.Product,
                  price:item.Subtotal,
                  tax:item.Tax
                })
            }
        });
        return array;
  }


let quote = await getQuoteID(id);
quoteData = quote.data[0];
let details = await getQuoteDetails(id);
let product = await getProductList(id);
prodData = product.data;
let detailArr = getDetailsByID(details.data);
detailData = detailArr;
let quoteCreate = {
        quote:quoteData,
        detailArray: detailData
        }
    return quoteCreate;
}