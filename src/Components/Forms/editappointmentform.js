import { Form, Input, Select, Button, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { getAddressList, getCustomers, updateEstimateInfo } from '../../api/calendar';
import { jobs } from '../../util/storedArrays';

const {TextArea} = Input;
const {Option} = Select;
export default function EditAppointmentForm(props) {
    const data = props.data;
    const currCust = props.cust;
    const currAdd = props.add;
    const [customers,setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] =useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const func = async() => {
          let resultC = await getCustomers();
          setCustomers(resultC.data);
          let resultA = await getAddressList(currCust.CustomerID)
          setAddresses(resultA.data);
        }
        func();
      },[addresses.length]);


    const options = customers.map((item) => (
        {
            label:`${item.CustFirstName} ${item.CustLastName}`,
            value:`${item.CustomerID}`
        }
    ))
    const options2 = addresses.map((item) => (
      {
        label:`${item.Address}`,
        value:`${item.AddressID}`
      }
    ));
    const options3 = jobs.map((item)=> (
      <Option key={item}>{item}</Option>
    ))
    const setJobs = () => {
      let jobArr = data.JobType.split(',');
      return jobArr;
    }

    const getAddressInfo = (opt) => {
      let address = addresses.find(element => element.AddressID == opt.value);
      setAddress(address);
    }

    const updateAppt = async() => {
      let values = form.getFieldsValue();
      let value = 
      {
        estimateID:data.EstimateID, 
        customer:values.editCustomer.value,
        address:values.editAddress.value,
        info:values.editInfo,
        jobTypes:values.editJobs,
        region:address.Region
      }
      let result = await updateEstimateInfo(value.estimateID, value);
            if(result.status === 200) {
              message.success("Appointment updated");
            }
            else message.error("Something went wrong");

          props.closeForm();
    }
    if(customers !== []) {
             return (
        <>
        <Form form={form} onFinish={updateAppt} initialValues={{
          ["editCustomer"]:{label:`${currCust.CustFirstName} ${currCust.CustLastName}`,
                            value:`${currCust.CustomerID}`},
          ['editAddress']:{
                            label:`${currAdd.Address}`,
                            value:`${currAdd.AddressID}`},
          ["editJobs"]:setJobs(),
          ["editInfo"]:data.text
        }}>
            <Form.Item label="Edit Customer" name="editCustomer">
                <Select labelInValue showSearch={true} options={options} />
            </Form.Item>
            <Form.Item label="Edit Address" name='editAddress'>
                <Select labelInValue showSearch={true} onSelect={(value, option) => {getAddressInfo(option)}} options={options2} />
            </Form.Item>
            <Form.Item label="Edit Job Types" name="editJobs">
                <Select mode="multiple" >{options3}</Select>
            </Form.Item>
            <Form.Item
        label="Edit Appt Information" name="editInfo">
          <TextArea
          title="Change appointment information">
          </TextArea>
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType='submit'>Update</Button>    
        </Form.Item>   
        </Form>
        </>
    )
        }
   else return (
    <>
    Loading...
    </>
   )
}

/*
        </Form.Item>
          <Button
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
      </>
*/