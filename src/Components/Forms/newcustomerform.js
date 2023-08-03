import { Card, Col, Form, Input, Row, Button, Select, Checkbox, message, Space, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { regions } from "../../util/storedArrays";
import { CheckForExisting, checkForMultipleBilling } from "../../config/checks";
import { addCustomer, addAddress } from "../../api/neworder";
import React, { useEffect, useState } from 'react';
import validator from 'validator';
const {Option} = Select;
const { Item } = Form;

export default function NewCustomerForm(props) {
  const [form] = Form.useForm();
  const [contractor,setContractor] = useState("none");
  const [contractorState, setContractorState] = useState(false);
  const [emailVal, setEmailVal] = useState();

    const sendInfo = async(values) => {
      let billing = "";
        form.validateFields();
        if(values.addresses !== undefined && contractorState !== true){
           values.addresses.forEach((item) => {
          if(item.billing) billing = item;
        })
        }
        else {
          billing = {
            address: values.ContractorAdd,
            city: values.ContractCity,
            postal: values.ContractPost,
            region: values.ContractRegion
          }
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
      if(contractorState === false) {
      if(checkForMultipleBilling(array)){
        return Promise.reject(new Error('Only one billing address'))
      }
      else return Promise.resolve();
    } 
  }

    const contractorTrue = () => {
      if(contractor === "block"){
        setContractor("none");
        setContractorState(false)
      }
      else {
        setContractor("block");
        setContractorState(true);
        }    
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
                                onKeyDown={(e) => {
                                  if(e.key == " "){
                                    e.preventDefault();
                                    return false
                                  }
                                  else return true}}
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
                      >
                      Contractor
                    </Checkbox>
                  </Item>
                  <div style={{display:contractor}}>
                    
                      <Row>
                        <Col>
                          <Item name="contractorAdd">
                            <Input
                            placeholder="Contractor Address" />
                          </Item>
                        </Col>
                        <Col>
                        <Item>
                            <Checkbox defaultChecked={true}>Billing Address</Checkbox>
                          </Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <Item name="ContractCity">
                          <Input placeholder="City" />
                        </Item>
                        </Col>
                        <Col>
                        <Item name="ContractPost" >
                          <Input placeholder="Postal Code" />
                        </Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
               <Col span={18}>
                        <Item name="ContractRegion">
                          <Select>
                          {options}
                          </Select>
                        </Item>
                    </Col>
                      </Row>
                  </div>
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
                billing: false,
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
                    <Input placeholder="Contact Name" />
                  </Form.Item>
                  </Col>
                  <Col>
                  <Form.Item {...restField} 
                  name={[name,"contractPhone"]}
                  >
                    <Input placeholder="Contact Number" />
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