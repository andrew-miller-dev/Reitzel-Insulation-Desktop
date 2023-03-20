import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";

const { format, utcToZonedTime} = require("date-fns-tz");

function Confirmation(props){
    return(
        <Email title="Thank you for choosing Reitzel!">
            <Item>
                <img src={header}></img>
            </Item>
            <Item>
                <p>Hi {props.customerInfo.CustFirstName} {props.customerInfo.CustLastName},</p>
            <br/>
            <p>Thank you for choosing Reitzel Insulation! Here are the details for your free estimate:</p>
            <p>Job Type: {props.estimateInfo.JobType}</p>
            <p>Date: {format(new Date(props.estimateInfo.startDate),"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(utcToZonedTime(props.estimateInfo.startDate,"America/Toronto"),"K:mm b")}</p>
            <br />
            </Item>
            <Item>
            Please read the attached PDF for preparing your home.
            </Item>
            <Item>
                <p>
                    This is an automated email. If you have any questions after reading this document, please email the office at admin@reitzel.ca or call the office at 519-886-6100 or
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

export default Confirmation;