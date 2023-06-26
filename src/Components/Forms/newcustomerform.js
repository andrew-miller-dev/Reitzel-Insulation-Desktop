import { Card, Col, Form, Input, Row, Button, Select, Checkbox, message, Space, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { regions } from "../../util/storedArrays";
import { CheckForExisting, checkForMultipleBilling } from "../../config/checks";
import { addCustomer, addAddress } from "../../api/neworder";
import React, { useState } from 'react'
const {Option} = Select;
const { Item } = Form;

export default function NewCustomerForm(props) {
  const [form] = Form.useForm();
  const [contractor,setContractor] = useState("none");

    const sendInfo = async(values) => {
      let billing = "";
        form.validateFields();
        if(values.addresses !== undefined){
           values.addresses.forEach((item) => {
          if(item.billing) billing = item;
        })
        }
        let num = values.isContractor ? 1 : 0;
       let newInfo = {
        CustFirstName : values.firstName,
        CustLastName:values.lastName,
        Phone:values.phone,
        Email:values.email,
        CustCity:billing.city,
        CustPostalCode:billing.postal || " ",
        CustRegion:billing.region,
        BillingAddress:billing.address,
        IsContractor:num,
       }
        const check = await CheckForExisting(newInfo);
        if(check.length > 0){
          message.warn("Customer already on file");
        }
        else{
        let customerInfo = await addCustomer(newInfo);
        var latestCustomer = customerInfo.data.insertId;
        if(values.addresses !== undefined){
          values.addresses.forEach(async(item) => {
            let addressInfo = {
              City:item.city,
              PostalCode:item.postal,
              Region:item.region,
              BillingAddress:item.address,
              ContractName:item.contractName,
              ContractPhone:item.contractPhone
            }
            var newAddress = await addAddress(latestCustomer, addressInfo);
          })
        }
        const customer = {
        CustomerID: latestCustomer,
        CustFirstName : values.firstName,
        CustLastName:values.lastName,
        Phone:values.phone,
        Email:values.email,
        CustCity:billing.city,
        CustPostalCode:billing.postal,
        CustRegion:billing.region,
        BillingAddress:billing.address
        }
        if(props.setDisplay){
          props.setDisplay(customer);
        }
        message.success("Customer added");
        props.close();
        }
    }

    const options = regions.map((item, index) => (
      <Option key={index + 1}>{item}</Option>
    ));

    const checkBilling = () => {
      let array = form.getFieldValue('addresses');
      if(checkForMultipleBilling(array)){
        return Promise.reject(new Error('Only one billing address'))
      }
      else return Promise.resolve();
    }
    const contractorTrue = () => {
      if(contractor === "block"){
        setContractor("none");
      }
      else setContractor("block");
    }

    return (
        <Form form={form} layout="vertical" onFinish={sendInfo} preserve={false}>
            <Card title="Add new customer">
              <Row justify="space-between">
                <Col>
                <Card title="Contact Info">
                    <Row>
                    <Col>
                    <Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                       message: "Required",
                   },
                    ]}>
                    <Input placeholder="First Name" />
                </Item>
                 </Col>
                 <Col>
                <Item
                name="lastName"
                rules={[
                  {
                    required: true,
                   message: "Required",
               },
                ]}>
                    <Input placeholder="Last Name" />
                </Item>
                     </Col>
                 </Row>
                 <Row>
                     <Col>
                     <Item
                     name="email"
                     rules={[
                          {
                              type:"email",
                              message:"Not a valid email"
                          },
                          {
                               required: true,
                              message: "Required",
                          },
                          
                         
                      ]}>
                         <Input placeholder="Email"
                          />
                     </Item>
                     </Col>
                     <Col>
                     <Item
                     name="phone"
                     rules={[
                      {
                        required: true,
                       message: "Required",
                   },
                    ]}>
                         <Input placeholder="Phone Number" />
                     </Item>
                     </Col>
                 </Row>
                 <Row>
                  <Col>
                  <Item name="isContractor"
                        defaultValue={false}
                        valuePropName="checked">
                      <Checkbox onClick={()=> {contractorTrue()}}
                      //onChange={}
                      >
                      Contractor
                    </Checkbox>
                  </Item>
                  
                  </Col>
                 </Row>
            </Card>
                </Col>
                <Col>
                <Card title="Addresses">
              <Form.Item >              
            <Form.List 
              name="addresses"
              initialValue={[
                {address:"",
                billing:true,
                city:"",
                postal:"",
                region:""}
              ]} 
            >
            
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div>
                <div style={{display:contractor}}>
                <Row>
                  <Col>
                  <Form.Item {...restField} 
                  name={[name,"contractName"]}
                  >
                    <Input placeholder="Contractor Name" />
                  </Form.Item>
                  </Col>
                  <Col>
                  <Form.Item {...restField} 
                  name={[name,"contractPhone"]}
                  >
                    <Input placeholder="Contractor Number" />
                  </Form.Item>
                  </Col>
                </Row>
                </div>
              <Row>
                <Col span={14}> <Form.Item
                  {...restField}
                  name={[name, 'address']}
                  rules={[{required:true,
                    message:"Required"}]}
                >
                  <Input placeholder="Address"/>
                </Form.Item>
                </Col>
               <Col>
               <Form.Item
                 {...restField}
                 name={[name, 'billing']}
                 valuePropName="checked"
                 rules={[{validator:checkBilling}]}
                 >
                   <Checkbox defaultValue={false}>Billing Address</Checkbox>
                 </Form.Item>
                </Col>
              </Row>
             <Row>
                <Form.Item
                  {...restField}
                  name={[name, 'city']}
                  rules={[{required:true,
                    message:"Required"}]}
                >
                  <Input placeholder="City"/>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'postal']}
                >
                  <Input placeholder="Postal Code"/>
                </Form.Item>
             </Row>
             <Row gutter={16}>
               <Col span={18}>
               <Form.Item
               {...restField}
               name={[name, 'region']}
               rules={[{required:true,
                message:"Required"}]}
               >
                 <Select placeholder="Select a region">{options}</Select>
               </Form.Item>
               </Col>
               
               <MinusCircleOutlined onClick={() => remove(name)} />
             </Row>             
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add another address
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>
            </Card>
                </Col>
              </Row>
                
            
            </Card>
        <Item>
            <Button type="primary" htmlType="submit">Add Customer</Button>
        </Item>
        </Form> 
    )
}