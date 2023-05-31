import {message, Modal} from 'antd';
import { Button, Form, Popup, TextArea } from 'devextreme-react';
import { ButtonItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { deleteEstimate, updateEstimateInfo } from '../../../api/calendar';
import { getCustomer } from '../../../api/customer';
import { getUser } from '../../../util/storage';
import { GetUserByID } from '../../../api';

const {format, utcToZonedTime} = require('date-fns-tz');


export default function SalesTooltip (model) {
  const data = model.data.appointmentData;
  const [address, setAddress] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [info, setInfo] = useState(data.text);
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
      {displayJobType()}
      <div style={{display:'flex', justifyContent:'space-between', color:'cornflowerblue'}}>
        <span>Created By: {`${user.FirstName} ${user.LastName[0]}`} </span>
        <span>{format(utcToZonedTime(data.CreationDate,"America/Toronto"),"MMMM do',' yyyy")}</span>
      </div>
      
       </div>
    <Popup
    visible={showPop}
    showTitle={true}
    title="Appointment editing"
    width='40%'
    height='30%'
    >
    <>
    <form 
    onSubmit={async(e) => {
      let result = await updateEstimateInfo(data.EstimateID, info);
      if(result.status === 200) {
        message.success("Appointment updated");
      }
      else message.error("Something went wrong");
      e.preventDefault();
      
    }}>
      <Form>
        <SimpleItem
        dataField="Info"
        label={{text:"Change appointment information",location:"top"}}>
          <TextArea
          id="UpdatedInfo"
          title="Change appointment information"
          defaultValue={info}
          onChange={(e) => {setInfo(e.component._changedValue)}}>
          
          </TextArea>
        </SimpleItem>
          <ButtonItem
          horizontalAlignment="center"
          buttonOptions={{text:'Update',type:'Success',useSubmitBehavior:false, onClick:() => {return new Promise(async(resolve, reject) => {
            let result = await updateEstimateInfo(data.EstimateID, info);
            if(result.status === 200) {
              message.success("Appointment updated");
            }
            else message.error("Something went wrong");
            setShowPop(false);
            resolve();
            
          })}}}
          />
      </Form>
    </form>
    
    </>
      
    </Popup>
    </div>

  )
}