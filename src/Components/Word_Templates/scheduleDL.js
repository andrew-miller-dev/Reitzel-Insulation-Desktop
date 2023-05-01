import React, { useEffect, useState } from 'react';
import html2pdf from "html2pdf.js";
import { message } from 'antd';
import LogoHeader from '../../assets/header';

const { format} = require('date-fns-tz');
var add = require('date-fns/add')

export default function ScheduleDLTemplate(props) {
    const [list, setList] = useState([]);

    useEffect(() => {
        let list = props.list.sort((a,b) => {
            return a.startDate.localeCompare(b.startDate);
        })
        setList(list);
        setTimeout(download,300)
    })

    const timeFormat = (date) => {
        let newdate = new Date(date);
        var formatteddate = format(newdate, "hh:mm");
        return formatteddate;
     }
     const download = async() => {
        try{
        let pdf = document.getElementById("schedule");
        let options = {
            filename: `Schedule_${format(new Date(),"MMMM'_'do'_'yyyy")}`
        }
        var worker = await html2pdf().set(options).from(pdf).save();
      }
      catch(e) {
        message.error("Something went wrong. Please try again")
        console.log(e);
      }
      finally {

      }
    }
    
    return (
        <div>
            <p>Generating report...</p>
            <div style={{display:"none"}}>
                <div id="schedule" style={{margin:"50px"}}>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <p style={{justifyContent:""}}>Schedule for {format(new Date(),"MMMM do',' yyyy" )}</p>
                    </div>
                    
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