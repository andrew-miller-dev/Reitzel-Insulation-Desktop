import { findProps } from 'devextreme-react/core/template';
import React from 'react';
import Text from 'react';
import { Email, Item, Box, Image} from 'react-html-email';
import {Card} from 'antd';
const header = "https://i.ibb.co/0snCVqq/header.png";
const footer = "https://ibb.co/kHTHdfL";



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
          <br /> Site Province: {customer.site_prov}
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
                                {prod.notes}
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
    </Box>
  </Email>
)
}

export default QuoteEmail;