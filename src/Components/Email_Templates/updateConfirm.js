import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';
import LogoHeader from "../../assets/header";
const user = getUser();

const {format} = require("date-fns-tz");

function Confirmation(props){
    return(
        <Email title="">
            {LogoHeader()}
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
                This is an automated email. If you have any questions after reading this document, please reply to your representative at {user.Email} or call the office at 519-886-6100 or
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

export default Confirmation;