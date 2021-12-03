import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { Button, Form, Popup, TextArea } from 'devextreme-react';
import { deleteWorkOrder } from '../../../api/calendar';
import {message, Modal} from 'antd';

const {format} = require('date-fns-tz');


export default function FillTooltip(model) {
    const data = model.data.appointmentData;
  const [address, setAddress] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [info, setInfo] = useState(data.text);
  useEffect(() => {
    const func = async() => {
      let result = await getAddress(data.AddressID)
      setAddress(result.data[0]);
    }
    func();
  },[address.length]);
  const deleteClicked = async() => {
    Modal.confirm({title:"Do you want to delete this appointment?", onOk(){deleteWorkOrder(data.WorkOrderID)}});
  }

  const editClicked = async(data) => {
    setShowPop(true);
  }

    return(
        <div>
             <div style={{float:'right'}}>
        <Button hint='Edit appointment' icon='clearformat' onClick={editClicked}></Button><Button icon='clearsquare' hint="Delete appointment" title='DeleteButton' onClick={deleteClicked}></Button>
      </div>
      <b style={{fontSize:15}}>
         {data.text}
      </b>
      <p>
       {address.Address} {address.City}, {address.Province}
       <br/>
       {address.PostalCode}
      </p>
      
      <p style={{color:'grey'}}>{`${format(new Date(data.startDate),"h':'mm aa")} - ${format(new Date(data.endDate),"h':'mm aa")}`}</p>
        </div>
    )
}