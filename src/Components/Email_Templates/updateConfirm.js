import React from 'react';
import { Email, Item, A} from 'react-html-email';
const header = "https://i.ibb.co/0snCVqq/header.png";

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
            <A href="C:\Users\amill\OneDrive\Documents\GitHub\sodv2999_team_explorers\src\assets\Customer Info Sheet _ Reitzel Insulation.pdf" download="Customer_Info_Sheet_Reitzel_Insulation">Customer Info</A>
                <br/>
                Download COVID-19 protocols:<br />
                <A href="C:\Users\amill\OneDrive\Documents\GitHub\sodv2999_team_explorers\src\assets\COVID-19.docx" download="COVID-19">COVID-19 Info</A>

            </Item>
            <Item>
               If you have any questions after reading this document, please reply to my email or call the office at 519-886-6100.
            Thank you for your business!
            Regards,

            The Reitzel Team 
            </Item>

            


        </Email>
    )
}

export default Confirmation;