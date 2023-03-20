import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";


const { format} = require("date-fns-tz");

function UpdateWork(props){
    const user = getUser();
    return(
        <Email title="">
            <Item>
            <img src={header}></img>
            </Item>
            <Item>
            <br />
            <p>There has been a change in your appointment time. Here are the new details for your booking:</p>

            <p>Date: {format(props.info.startDate,"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(props.info.startDate,"K:mm")}</p>
            <br />
            </Item>
            <Item>
                <p>
                This is an automated email. If you have any questions after reading this document, please email the office at admin@reitzel.ca or call the office at 519-886-6100 or
                    toll free at 1-800-265-8869.
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

export default UpdateWork;