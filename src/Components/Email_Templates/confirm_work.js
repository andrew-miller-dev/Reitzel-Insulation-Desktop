import { getCustomer } from "../../api/customer";
import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';

const header = "https://i.ibb.co/0snCVqq/header.png";
const { format} = require("date-fns-tz");


export default function ConfirmWorkOrder(props) {
    const customer = async() => {
        let info = await getCustomer(props.info.CustomerID);
        return info.data[0];
    } 
    const user = getUser();

    return(
        <Email title="Your upcoming Reitzel appointment">
            <Item>
                <img src={header}></img>
            </Item>
            <Item>
                <p>Hi {customer().CustFirstName} {customer().CustLastName},</p>
            <br/>
            <p>Thank you for choosing Reitzel Insulation! Here are the appointment details for your upcoming job:</p>

            <p>Date: {format(new Date(props.info.startDate),"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(new Date(props.info.startDate),"K:mm")}</p>
            <br />
            </Item>
            <Item>
            Please find the job details below.
            </Item>
            <Item>
                <p>
                This is an automated email. If you have any questions after reading this document, please reply to your representative at {user.Email} or call the office at 519-886-6100 or
                    toll free at 1-800-265-8869.
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