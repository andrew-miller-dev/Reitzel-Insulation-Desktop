import React from 'react';
import { Email, Item, Box, Image} from 'react-html-email';
import LogoHeader from '../../assets/header';
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
  <Email title="Reitzel Insulation Quote">  
  {LogoHeader()}
    <Box>   
      <Item align='right'>
        {customer.quoteDate}
      </Item>
        <Item>
          Thank you for choosing Reitzel Insulation. Please find your quote attached.
        </Item>
        <br />
        <span>This is an automated email. If you have any questions after reading this document, please call the office at 519-886-6100 or
              toll free at 1-800-265-8869. </span>
        <br />
        <span>Estimator:{customer.userInfo.FirstName + " " + customer.userInfo.LastName}</span>
        <br/>
        <span>Regards, Reitzel Insulation</span>
    </Box>
  </Email>
)
}

export default QuoteEmail;