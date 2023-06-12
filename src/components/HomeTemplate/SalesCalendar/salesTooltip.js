import {Modal, Button, Input, Tooltip} from 'antd';
import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { deleteEstimate} from '../../../api/calendar';
import { getCustomer } from '../../../api/customer';
import { GetUserByID } from '../../../api';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import EditAppointmentForm from '../../Forms/editappointmentform';

const {format, utcToZonedTime} = require('date-fns-tz');
const {TextArea} = Input;

export default function SalesTooltip (model) {
  const data = model.data.appointmentData;
  const [info, setInfo] = useState(data.text);
  const [address, setAddress] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [showPop, setShowPop] = useState(false);
  
 const [user, setUser] = useState([]);
  useEffect(() => {
    const func = async() => {
      let resultC = await getCustomer(data.CustomerID);
      let result = await getAddress(data.AddressID);
      let resultU = await GetUserByID(data.UserID);
      setCustomer(resultC.data[0]);
      setAddress(result.data[0]);
      setUser(resultU.data[0]);
    }
    func();
  },[address.length]);

  const deleteClicked = async() => {
    Modal.confirm({title:"Do you want to delete this appointment?", onOk(){deleteEstimate(data.EstimateID)}});
  }

  const editClicked = async(data) => {
    setShowPop(true);
  }
  const close = () => {
    setShowPop(false);
  }
  const displayJobType = () => {
    const jobArr = data.JobType.split(',');
    return(
      <div>
        <b>Estimate Job Types</b>
          {jobArr.map((item)=> {
            return(
              
            <span>
              <br />
              {item}</span>
            )
          } ) }
      </div>
     
    )
   
  }
  return (
    <div>
      <div style={{float:'right'}}>
        <Tooltip title="Edit">
          <Button style={{border:0}} icon={<EditFilled />} onClick={editClicked}></Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button style={{border:0}} icon={<DeleteFilled />} onClick={deleteClicked}></Button>
        </Tooltip>
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
      {displayJobType()}
      <div style={{display:'flex', justifyContent:'space-between', color:'cornflowerblue'}}>
        <span>Created By: {`${user.FirstName} ${user.LastName}`} </span>
        <span>{format(utcToZonedTime(data.CreationDate,"America/Toronto"),"MMMM do',' yyyy")}</span>
      </div>
       </div>
    <Modal
    visible={showPop}
    showTitle={true}
    onCancel={() => {setShowPop(false)}}
    title="Appointment editing"
    width='40%'
    height='30%'
    footer={false}
    >
      <EditAppointmentForm closeForm = {close} data={data} cust = {customer} add = {address} />
    </Modal>
    </div>
  )
}