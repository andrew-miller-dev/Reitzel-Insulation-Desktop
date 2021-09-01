import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';


const {format} = require('date-fns-tz');


export default function SalesToolSnap (model) {
  const data = model.data.appointmentData;
  const [address, setAddress] = useState([]);
  useEffect(() => {
    const func = async() => {
      let result = await getAddress(data.AddressID)
      setAddress(result.data[0]);
    }
    func();
  },[address.length]);

  return (
    <div>
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