import React from 'react';
import { Email, Item, Box, Image} from 'react-html-email';
const header = "https://i.ibb.co/0snCVqq/header.png";
const footer = "https://i.ibb.co/tm6mdt0/footer.png";

const getTotal = (array) => {
    let gtotal = 0;
    array.forEach((item) => {
      gtotal = gtotal + parseFloat(item.total);
    })
    return gtotal;
}

const getTaxes = (array) => {
  let ttotal = 0.00;
  array.forEach((item) => {
    item.productArr.forEach((item) => {
      ttotal = ttotal + item.tax;
    })
  })
  return ttotal;
}

function QuoteEmail (props) {
  let customer = props.info;
return (
  <Email title="Reitzel Insulation Quote Details"> 
    <Box>
    <Image src={header} alt="Reitzel Insulation" width={875} height={100}>
    </Image>
      <Item align='right'>
        {customer.quoteDate}
      </Item>
        <div style={{display:"flex"}}>
          <div style={{margin:'5px'}}>
            <strong>Attention:</strong> {customer.first_name}{" "}
          {customer.last_name}
          <br /> Address: {customer.billing_address}
          <br /> City: {customer.city}
          <br /> Postal Code: {customer.post_code}
          <br /> Phone: {customer.phone_number}
          <br /> Email: {customer.email}
          <br />
          </div>
          <div style={{margin:'5px', display:props.siteCard}}>
          <strong>Site Address</strong>
          <br /> Site Address: {customer.site_address}
          <br /> Site City: {customer.site_city}
          <br /> Site Postal Code: {customer.site_postal}
          </div>
      </div>
      <div>
          {customer.details.length > 0 && (
            <table style={{border:"none"}} width="100%" cellPadding="10px">
              <tbody>
                {customer.details.map((item) => {

                    return (
                      <tr key={item.key}>
                      <tr>
                        <td colSpan="3" style={{width:'100%', minWidth:"875px"}}>
                          {item.details}
                        </td>
                        
                      </tr>
                      {item.productArr.map((prod) => {
                        return (
                            <tr key={prod.prodKey}>
                              <td>
                                {prod.product}
                              </td>
                                <td>
                                  $ {prod.price}
                                </td>
                              </tr>
                          );
                          })}
                      <tr>
                        <td colSpan="3" style={{textAlign:"right"}}>
                          Subtotal:${item.total} + HST
                        </td>
                      </tr>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          )}
        </div>
        <span>Notes: {customer.customer_notes}</span>
        <p>Quote is valid for 30 days from the date on the quote</p>
        <br />
        Taxes: ${getTaxes(customer.details)}
        <br/>
        <span>Quote grand total: ${getTotal(customer.details)}</span>
        <br />
        <span>This is an automated email. If you have any questions after reading this document, please call the office at 519-886-6100 or
              toll free at 1-800-265-8869. </span>
        <br />
        <span>Estimator:{customer.userInfo.FirstName + " " + customer.userInfo.LastName}</span>
        <br/>
        <span>Regards, Reitzel Insulation</span>

  <Image src={footer} alt="Reitzel Insulation" width={875} height={100}>
    </Image>

    </Box>
  </Email>
)
}

export default QuoteEmail;