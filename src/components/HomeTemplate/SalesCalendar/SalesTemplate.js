import React,{useState, useEffect} from 'react';
import { getAddress } from '../../../api/addresses';

export default function SalesTemplate(model) {
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
    <div
    style={{
      fontSize:11,
      wordWrap:"break-word",
      whiteSpace:"normal"
    }}>
        <div>
        {address.Address}
        </div>
    </div>
  );
}