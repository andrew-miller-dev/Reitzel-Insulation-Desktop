import { getDetailsByID } from "../../api/calendar";
import { getProductsFromOrderID } from "../../api/orders";
import WorkToPDF from "../../Components/Word_Templates/workPDF";


export default async function WorkToPDFConvert (data) {
    let details = await getDetailsByID(data.WorkOrderID);
    let products = await getProductsFromOrderID(data.WorkOrderID);

    const detailArr = () => {
        const detail = [];
        details.data.map((item) => {
            const detailObj = {
                id:item.WODetailID,
                details:item.Details,
                total:item.DetailTotal,
                productArr:prodArr(item.WODetailID)
            }
            detail.push(detailObj);
        });
        return detail;
    }

    const prodArr = (id) => {
        let prod = [];
        products.data.forEach((item) => {
            console.log(item);
            if(item.WODetailID === id){
                prod.push({
                    id:item.WOProdID,
                    detailID:item.WODetailID,
                    product:item.Product,
                    notes:item.Notes,
                    price:item.Price
            })
            }
        });
        return prod;
    }

    const PDFobject = () => {
        let obj ={
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
        details:detailArr(),
        total:data.TotalAmount
    }
    return obj;
    }
    
    WorkToPDF(PDFobject());

    return null;
}