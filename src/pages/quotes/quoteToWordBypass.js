import QuoteToWord from "../../Components/Word_Templates/quoteWord";
import {getQuoteDetails, getProductList} from '../../api/quoteEditAPI';



export default async function GetWordDoc(info) {
let details = await getQuoteDetails(info.QuoteID);
let products = await getProductList(info.QuoteID);
let data = info;

let createWordObject = () => {
    let wordObj = {
        first_name:data.CustFirstName,
        last_name:data.CustLastName,
        billing_address:data.BillingAddress,
        city:data.CustCity,
        post_code:data.CustPostalCode,
        phone_number:data.Phone,
        email:data.Email,
        site_address:data.Address,
        site_city:data.City,
        site_prov:data.Province,
        site_postal:data.PostalCode,
        details:getDetailsByID(data.QuoteID),
        customer_notes:data.notesCustomers,
        installer_notes:data.notesInstallers,
        total:data.QuoteTotal
    }
    return wordObj;
}


const getDetailsByID = (id) => {
    let array = [];
    details.data.forEach((item) => {
      if(item.quoteID === id){
        array.push({
          quoteID:item.quoteID,
          id:item.subtotalID,
          details:item.subtotalLines,
          total:item.subtotalAmount,
          productArr:getProductArr(item.SubtotalID)
        });
      }
    });
    return array;
}
const getProductArr = (id) => {
  let array = [];
  products.data.forEach((item) => {
         if(item.subtotalID === id){
              array.push({
                prodID:item.QuoteLineID,
                product:item.Product,
                notes:item.Notes,
                price:item.Subtotal
              })
          }
      });
      return array;
}
QuoteToWord(createWordObject());

return null;
}