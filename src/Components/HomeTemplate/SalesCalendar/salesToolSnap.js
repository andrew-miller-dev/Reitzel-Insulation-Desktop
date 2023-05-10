import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { getCustomer } from '../../../api/customer';

const {format} = require('date-fns-tz');


export default function SalesToolSnap (model) {
  const data = model.data.appointmentData;
  const [address, setAddress] = useState([]);
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    const func = async() => {
      let resultC = await getCustomer(data.CustomerID);
      let result = await getAddress(data.AddressID);
      setCustomer(resultC.data[0]);
      setAddress(result.data[0]);
    }
    func();
  },[address.length]);

  return (
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
  )
}