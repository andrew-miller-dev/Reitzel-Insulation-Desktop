import { useEffect, useState } from "react";
import { checkForWeekend, isValidDate } from "../../../config/checks";
import './styles.css'


export default function DataCell(props) {
    const [style, setStyle] = useState("");

    useEffect(()=> {
        if(isValidDate(props.itemData.startDate)){
        }
        else {
            setStyle('disabled');
        }
    },[])
    
    return (
        <div className={style}>
        </div>
    )
}