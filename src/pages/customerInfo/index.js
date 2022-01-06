import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Select, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {getRegion, updateCustomer, getCustomer, getCustomerAddresses, deleteCustomer, addAddress, addNotes, getNotes} from '../../api/customer';

import { useRouteMatch } from "react-router-dom";
import { withRouter } from "react-router";
import {getUser} from '../../util/storage';
import { getRegionAPI } from '../../api/calendar';
const { Item } = Form;
const { confirm } = Modal;
const { Option } = Select;
const {TextArea} = Input;
const { format } = require('date-fns-tz')

export function CustomerInfo() {

  let match = useRouteMatch('/customerinfo/:customer').params.customer;
  const [showForm, setShowForm] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [formAddress] = Form.useForm();
  const [form1] = Form.useForm();
  const [regions, setRegions] = useState([]);
  const [customerInfo, setcustomerinfo] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [user, setUser] = useState("");
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);

  const options = regions.map((item) => (
    <Option key={item.id}>{item.name}</Option>
  ));
    useEffect(() => {
        const func = async () => {
           await getCustomer(match).then((info) => {
            var customerInfo = info.data.map((item) =>({
            id: item.CustomerID,
            firstName: item.CustFirstName,
            lastName: item.CustLastName,
            email: item.Email,
            phone: item.Phone,
            billing: item.BillingAddress,
            city: item.CustCity,
            postal: item.CustPostalCode,
            region: item.CustRegion
          }));
          setcustomerinfo(customerInfo[0]);
          });
          let userInfo = getUser();
          let initial = userInfo.FirstName.charAt(0) + userInfo.LastName.charAt(0);
          setUser(initial);
           await getNotes(match).then((notes) => {
            setNotes(notes.data);
          })
        };
        func();
        getAddressList();
        getRegions();
        document.getElementsByName("notes")[0].value = "";

        
      }, [count]);

    const getAddressList = async () => {
        await getCustomerAddresses(match).then((list) => {
          var addresses = list.data.map((item) =>({
          id: item.AddressID,
          address: item.Address,
          postalcode: item.PostalCode,
          city: item.City,
          region: item.Region
        }));
        setAddressList(addresses);
        })
      };
      const getRegions = async() => {
        var result = await getRegionAPI();
        var regionList = result.data.map((item) =>({
          id:item.RegionID,
          name:item.Region
        }));
        setRegions(regionList);
      }
      const title = (
        <div>
          <Space>

          
          <Button
            type="primary"
          onClick={() => {
              setShowForm(true);
              form1.setFieldsValue({
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              email: customerInfo.email,
              phone: customerInfo.phone,
              billing: customerInfo.billing,
             city: customerInfo.city,
              postal: customerInfo.postal,
              region: customerInfo.region
             });
            }}
          >
            Modify
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleDeleteCustomer(customerInfo.id);
            }}
          >
            Delete
          </Button>
          </Space>
        </div>
      )
      const handleUpdate = async () => {
        const validResult = await form1.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form1.getFieldsValue();
        const id = customerInfo.id;
        //update data in the backend
        const result = await updateCustomer(id, value.firstName, value.lastName, value.email, value.phone, value.billing, value.city, value.postal, value.region);
        setShowForm(false);

        if (result.status === 200) {
          message.success("Successfully updated customer information");
        }
      };
      const handleDeleteCustomer = async (id) => {
        confirm({
          title: "Are you sure you want to delete this customer?",
          icon: <ExclamationCircleOutlined />,
          content: "",
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk() {
            return new Promise((resolve, reject) => {
              const result = deleteCustomer(id);
              message.success("Customer has been successfully deleted");
              resolve();
              
            });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
        
      }
      const handleNewAddress = async () =>{
        const validResult = await formAddress.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = formAddress.getFieldsValue();
        const info = {
          BillingAddress: value.address,
          PostalCode: value.postalCode,
          City: value.city,
          Prov: value.prov,
          Region: value.region
        }
        let id = customerInfo.id;
        var result = await addAddress(id, info);
        if (result.status == 200){
          message.success("added new address");
        }
        setShowAddress(false);

      }
      const getNoteTable = () => {
        let rows = [];
        notes.map((item) => {
          rows.push(
            <tr>
              <td>
                {item.custNotes}
              </td>
              <td>
                {format(new Date(item.dateAdded), "MMMM do',' yyyy")}
              </td>
              <td>
                {item.UserInitial}
              </td>
            </tr>
         
            
          );
        });
        return rows;
      }
    const columns =[
      {
        title:"Address",
        dataIndex:"address",
        key:"address"
      },
      {
        title:"Postal Code",
        dataIndex:"postalcode",
        key:"postal"
      },
      {
        title:"City",
        dataIndex:"city",
        key:"city"
      },
      {
        title:"Region",
        dataIndex:"region",
        key:"region"
      }
      
    ]
      return(
        <div>
          <Card
          title = {title}
          >
            <div>
              <div style={{float:"left", width:"30%"}}>
              <Card title="Customer Information">
            <p>First Name: {customerInfo.firstName}</p>
            <p>Last Name: {customerInfo.lastName}</p>
            <p>Email: {customerInfo.email}</p>
            <p>Phone: {customerInfo.phone}</p>
            <br />      
        </Card>
        <Card title="Billing Address">
          <p>Billing Address: {customerInfo.billing}</p>
            <p>City: {customerInfo.city}</p>
            <p>Postal Code: {customerInfo.postal}</p>
        </Card>
            </div>
            <div style={{float:"right", width:"50%"}}>
              <h1>Customer Notes</h1>
              <Item>
                <table style={{display:'block', height:"350px", overflowY:"scroll", width:"100%"}}
              >
                <thead>
                  <tr>
                    <td style={{position:"sticky", top:"0", width:"60%", backgroundColor:"white"}}>
                      <strong>Notes</strong>
                    </td>
                    
                    <td style={{position:"sticky", top:"0", width:"30%", backgroundColor:"white"}}>
                      <strong>Date Added</strong>
                    </td>
                    <td style={{position:"sticky", top:"0", width:"10%", backgroundColor:"white"}}>
                      <strong>User Initial</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {getNoteTable()}
                </tbody>
              </table>
              </Item>
              
              <Item>
                <TextArea
                defaultValue=""
                name="notes"
                allowClear={true}
                autoSize={{minRows: 2, maxRows: 3}}
                onPressEnter={
                  async() => {
                    let box = document.getElementsByName("notes")[0];
                    await addNotes(box.value, user, match)
                    .then((item) => {
                      setCount(count + 1);
                      if(item.status === 200){
                      message.success("added new note");
                      box.value = " ";
                    }
                    else{
                      message.error("Something went wrong. Please try again.");
                      box.value = " ";
                    }        });
                  }
                }
                ></TextArea>
              </Item>
              <Item>
                <Button
                onClick={async() => {
                  let box = document.getElementsByName("notes")[0];
                  await addNotes(box.value, user, match)
                  .then((item) => {
                    setCount(count + 1);
                    if(item.status === 200){
                    message.success("added new note");
                    box.value = " ";
                  }
                  else{
                    message.error("Something went wrong. Please try again.");
                    box.value = " ";
                  }        });
                  
                  
                  
                  
                }}>
                Submit
                </Button>
              </Item>
              
            </div>
            </div>
            
        
            
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        bordered
        dataSource={addressList}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>

          </Table>
          <Button
          type="primary"
          onClick={() => {
            setShowAddress(true);
            formAddress.resetFields();
          }}
          >New Address</Button>

          <Modal
          visible={showForm}
          title="Update Customer"
          onOk={handleUpdate}
          onCancel={() => setShowForm(false)}
        >
          <Form form={form1} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
                
              ]}
              
            >
              <Input />
            </Item>
            <Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Email"
              name="email"
            >
              <Input />
            </Item>
            <Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Billing Address"
              name="billing"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Postal Code"
              name="postal"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
              </Item>
              <Item
              label="Region"
              name="region"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Select>{options}</Select>
            </Item>
          </Form>
        </Modal>
        <Modal
          visible={showAddress}
          title="New Address"
          onOk={handleNewAddress}
          onCancel={() => setShowAddress(false)}
          >
          <Form
              form={formAddress}
              labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
              >
              <Item 
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
              >
                <Input />
              </Item>
              <Item 
              label="Postal Code"
              name="postalCode"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
              >
                <Input />
              </Item>
              <Item 
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
              >
                <Input />
              </Item>
              <Item 
              label="Region"
              name="region"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Select>{options}</Select>
              </Item>

          </Form>
        </Modal>
        </Card>
        </div>
      )
    }

    export default withRouter(CustomerInfo)