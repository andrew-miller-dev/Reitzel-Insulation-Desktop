import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";
const footer = "https://ibb.co/kHTHdfL";
const user = getUser();

const { format} = require("date-fns-tz");

function Confirmation(props){
    
    return(
        <Email title="Thank you for choosing Reitzel!">
            <Item>
                <img src={header}></img>
            </Item>
            <Item>
                <p>Hi {props.customerInfo.FirstName} {props.customerInfo.LastName},</p>
            <br/>
            <p>Thank you for choosing Reitzel Insulation! Here are the details for your booking:</p>
            <p>Job Type: {props.estimateInfo.JobType}</p>
            <p>Date: {format(new Date(props.estimateInfo.startDate),"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(new Date(props.estimateInfo.startDate),"K:mm")}</p>
            <br />
            <p>Included is some information on "How to Prepare your Home Before Your Insulation Arrives."</p>
            <br/>
            </Item>
            <Item>
            Download document:
                <a href="src\assets\Customer Info Sheet _ Reitzel Insulation.pdf" download="Customer_Info_Sheet_Reitzel_Insulation">Customer Info</a>
                <br/>
                Download COVID-19 protocols:
                <a href="src\assets\COVID-19.docx" download="COVID-19">COVID-19 Info</a>
            </Item>
            <Item>
                <p>
                    This is an automated email. If you have any questions after reading this document, please reply to your rep at {user.Email} or call the office at 519-886-6100.
            Thank you for your business!
                </p>
               <Item>
                  <p>
                  Regards,
                    
            The Reitzel Team  
               </p> 
               </Item>
               
            
            </Item>


        </Email>
    )
}

export default Confirmation;