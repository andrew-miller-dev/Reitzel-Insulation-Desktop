import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { Button, Form, Popup, TextArea } from 'devextreme-react';
import { deleteWorkOrder } from '../../../api/calendar';
import {message, Modal} from 'antd';
import { getCustomer } from '../../../api/customer';

const {format} = require('date-fns-tz');


export default function FillTooltip(model) {
    const data = model.data.appointmentData;
  const [address, setAddress] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [customer, setCustomer]= useState([]);
  useEffect(() => {
    const func = async() => {
      let resultC = await getCustomer(data.CustomerID);
      let result = await getAddress(data.AddressID);
      setCustomer(resultC.data[0]);
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
        <>
             <div style={{float:'right'}}>
        <Button hint='Edit appointment' icon='clearformat' onClick={editClicked}></Button><Button icon='clearsquare' hint="Delete appointment" title='DeleteButton' onClick={deleteClicked}></Button>
      </div>
      <div style={{display:'flex',flexDirection:'column'}}>
      <b>{customer.CustFirstName} {customer.CustLastName}</b>
      <br/>
      <b>
      {address.Address}, {address.City}
       <br/>
       {address.PostalCode}
      </b>
      <p>
      {data.text}
      </p>
      
      <p style={{color:'grey'}}>{`${format(new Date(data.startDate),"h':'mm aa")} - ${format(new Date(data.endDate),"h':'mm aa")}`}</p>
       </div>
       </>
    )
}