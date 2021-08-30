import {message, Modal} from 'antd';
import { Button, Form, Popup, TextArea } from 'devextreme-react';
import { ButtonItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';
import { getAddress } from '../../../api/addresses';
import { deleteEstimate, updateEstimateInfo } from '../../../api/calendar';

const {format} = require('date-fns-tz');


export default function SalesTooltip (model) {
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
    Modal.confirm({title:"Do you want to delete this appointment?", onOk(){deleteEstimate(data.EstimateID)}});
  }

  const editClicked = async(data) => {
    setShowPop(true);
  }
  return (
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