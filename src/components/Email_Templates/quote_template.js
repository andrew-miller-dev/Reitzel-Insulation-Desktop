import React from 'react';
import Text from 'react';
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

function QuoteEmail (props) {
  let customer = props.info;
return (
  <Email title="Reitzel Insulation Quote Details"> 
    <Box>
    <Image src={header} alt="Reitzel Insulation" width={875} height={100}>
    </Image>
      <Item align="left">
     
          <strong>Attention:</strong> {customer.first_name}{" "}
          {customer.last_name}
          <br /> Address: {customer.billing_address}
          <br /> City: {customer.city}
          <br /> Postal Code: {customer.post_code}
          <br /> Phone: {customer.phone_number}
          <br /> Email: {customer.email}
          <br />

          <strong>Site Address</strong>
          <br /> Site Address: {customer.site_address}
          <br /> Site City: {customer.site_city}
          <br /> Site Postal Code: {customer.site_postal}

      </Item>
      <div>
          {customer.details.length > 0 && (
            <table width="100%" border="1" cellPadding="10px">
              <thead>
                <tr>
                  <td colSpan="3">Quote Details</td>
                </tr>
              </thead>
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
                                  {prod.price}
                                </td>
                              </tr>
                          );
                          })}
                      <tr>
                        <td colSpan="3" style={{textAlign:"right"}}>
                          Subtotal:${item.total}
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
        <br />
        <span>Quote grand total: ${getTotal(customer.details)}</span>
        <br />
        <span>Please feel free to contact our office if you have any questions or concerns regarding this quotation. </span>
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