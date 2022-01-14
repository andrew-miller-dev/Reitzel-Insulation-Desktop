import React from 'react';
import { Email, Item, A} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";
const user = getUser();

const {format, UtcToZonedTime} = require("date-fns-tz");

function Confirmation(props){
    
    return(
        <Email title="">
            <Item>
            <img src={header}></img>
            </Item>
            <Item>
            <br />
            <p>There has been a change in your appointment time. Here are the new details for your booking:</p>
            <p>Job Type: {props.estimateInfo.JobType}</p>
            <p>Date: {format(props.estimateInfo.startDate,"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(props.estimateInfo.startDate,"K:mm")}</p>
            <br />
            </Item>
            <Item>
            <p>Find attached documents to help prepare your house for your appointment</p>

            </Item>
            <Item>
                <p>
                    This is an automated email. If you have any questions after reading this email, please reply to your rep at {user.Email} or call the office at 519-886-6100.
            Thank you for your business!
                </p>
                <br />
                <p>
                    Regards,

            The Reitzel Team 
                </p>
               
            
            </Item>

            


        </Email>
    )
}

export default Confirmation;