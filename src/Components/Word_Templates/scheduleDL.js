import React, { useEffect } from 'react';
import html2pdf from "html2pdf.js";

const { format} = require('date-fns-tz');
var add = require('date-fns/add')

export default function ScheduleDLTemplate(props) {
    const list = props.list;

    useEffect(() => {
        setTimeout(download,300)
    })

    const timeFormat = (date) => {
        let newdate =add(new Date(date), {hours:-3});
        var formatteddate = format(newdate, "hh:mm");
        return formatteddate;
     }
     const download = () => {
        try{
        let pdf = document.getElementById("schedule");
        let options = 
        html2pdf(pdf);
      }
      catch(e) {
        console.log(e);
      }
    }
    
    return (
        <div>
            <p>Generating report...</p>
            <div>
                <div id="schedule">
                    <p>Today's report:</p>
                    <div>
                    {list.map((element) => {
            return(
                <> 
                <p>Time: {timeFormat(element.startDate)} - {timeFormat(element.endDate)}</p>
                <br/>
                <p>{element.CustFirstName} {element.CustLastName}</p>
                <p>{element.Address}, {element.PostalCode} {element.City}</p>
                <p>Job Type: {element.JobType}</p>
                <br/>
                <p>{element.EstimateInfo}</p>
                <p>-------------------------------------------------</p>
                </>
               
                )})}
                    </div>
                   
                </div>
            </div>
            
        </div>
    )
}