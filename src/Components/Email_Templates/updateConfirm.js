import React from 'react';
import { Email, Item, A} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";
const user = getUser();

const { format} = require("date-fns-tz");

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
            <p>Date: {format(new Date(props.estimateInfo.startDate),"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(new Date(props.estimateInfo.startDate),"K:mm")}</p>
            <br />
            </Item>
            <Item>
            Download document:<br />
            <a href="\assets\Customer Info Sheet _ Reitzel Insulation.pdf" download>Customer Info</a>
                <br/>
                Download COVID-19 protocols:<br />
                <A href="\assets\COVID-19.docx" download="COVID-19">COVID-19 Info</A>

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