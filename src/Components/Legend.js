import React, { useEffect, useState } from 'react';
import { getRegionAPI } from '../api/calendar';


function Legend(props) {

    useEffect(() => {
        let func = async() => {
            let result = await getRegionAPI();
            setRegionInfo(result.data);
        }
        func();
    }
    ,[]);
    const [regionInfo, setRegionInfo] = useState([]);

    const renderLegend = () => {
        let rows = [];

        regionInfo.map((item) =>{
            rows.push(

            
            <tr key={item.RegionID}>
                <td colSpan='2'>
                    <p>{item.Region}</p>
                </td>
                <td>
                    <div style={{backgroundColor:item.color, color:item.color, padding:"5px"}}>_</div>
                </td>
            </tr>);
        })
        return rows;
    }
    return (
        <div>
            <table style={{fontSize:"12px", width:"80%"}}>
                <thead>
                    <tr >
                        <td colSpan='2'>
                           <h1>Region</h1> 
                        </td>
                        <td>
                            <h1>Colour</h1>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {renderLegend()}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <i>Legend for Region Colours</i>
                        </td>
                    </tr>
                    
                </tfoot>
            </table>
        </div>
    )
}

export default Legend;