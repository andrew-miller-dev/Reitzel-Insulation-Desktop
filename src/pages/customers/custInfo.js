import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Select, Space } from "antd";
import { ExclamationCircleOutlined, EditFilled } from "@ant-design/icons";
import { getCustomer, getCustomerAddresses, deleteCustomer, addNotes, getNotes, deleteNote, getCustomerQuotes} from '../../api/customer';
import { addAddress, addContractAddress } from '../../api/neworder';
import { useRouteMatch } from "react-router-dom";
import { withRouter, useHistory } from "react-router-dom";
import {getUser} from '../../util/storage';
import { getRegionAPI } from '../../api/calendar';
import EditCustomerForm from '../../Components/Forms/Customer_Forms/editcustomerform';
import EditAddress from '../../Components/Forms/Customer_Forms/editaddressform';

const { Item } = Form;
const { confirm } = Modal;
const { Option } = Select;
const { format } = require('date-fns-tz')


export function CustomerInfo() {
  let history = useHistory();
  let match = useRouteMatch('/customers/:customer').params.customer;
  const [showAddress, setShowAddress] = useState(false);
  const [formAddress] = Form.useForm();
  const [regions, setRegions] = useState([]);
  const [customerInfo, setcustomerinfo] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [QandOlist,setQandOlist] = useState([]);
  const [user, setUser] = useState("");
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [contractor, setContractor] = useState("none");
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const options = regions.map((item) => (
    <Option key={item.id}>{item.name}</Option>
  ));
    useEffect(() => {
        const func = async () => {
           await getCustomer(match).then((info) => {
            var customerinfo = info.data.map((item) =>({
            id: item.CustomerID,
            firstName: item.CustFirstName,
            lastName: item.CustLastName,
            email: item.Email,
            phone: item.Phone,
            billing: item.BillingAddress,
            city: item.CustCity,
            postal: item.CustPostalCode,
            region: item.CustRegion,
            contractor: contractorCheck(item.IsContractor)
          }));
          if(customerinfo[0].contractor === true) {
            setContractor('block');
          }
          setcustomerinfo(customerinfo[0]);
          });
          let userInfo = getUser();
          let initial = userInfo.FirstName.charAt(0) + userInfo.LastName.charAt(0);
          setUser(initial);
           await getNotes(match).then((notes) => {
            setNotes(notes.data);
          });
          let quotes = await getCustomerQuotes(match);
        };
        func();
        getAddressList();
        getRegions();
      }, [count]);
    const contractorCheck = (num) => {
      if(num === 1) return true;
      else return false
    }
    const closeForm = () => {
      setShowModal(false);
      setCount(count + 1);
    }
  
    const getAddressList = async () => {
        await getCustomerAddresses(match).then((list) => {
          var addresses = list.data.map((item) =>({
          id: item.AddressID,
          address: item.Address,
          postalcode: item.PostalCode,
          city: item.City,
          region: item.Region,
          contractName: item.ContractorName,
          contractPhone:item.ContractorPhone
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
              setFormData(<EditCustomerForm data={customerInfo} close={closeForm} regionList={regions} />)
              setShowModal(true);
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
              history.push("/customers");
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
          Region: value.region,
          ContractorName :value.contractorName,
          ContractorNumber:value.contractorPhone
        }
        let id = customerInfo.id;
          var result = await addContractAddress(id, info);
        if (result.status == 200){
          message.success("New address added");
        }
        setShowAddress(false);
        setCount(count + 1);
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
              <td>
                <Button type="primary" danger
                onClick={async() => {
                  await deleteNote(item.custNotesID);
                  message.success("Note deleted");
                  setCount(count + 1);
                }}
                >X</Button>
              </td>
            </tr>
         
            
          );
        });
        return rows;
      }
    const columns2 = [
      {title:"Address",
      dataIndex:"",
      key:""},
      {title:"Salesman",
      dataIndex:"",
      key:""},
      {title:"Creation Date",
      dataIndex:"",
      key:""},
      {title:"Modified On",
      dataIndex:"",
      key:""},
      {title:"Status",
      dataIndex:"",
      key:""},
    ]

    const columns = () => {
      if(customerInfo.contractor == 0) {
        return [
      {title:"Address",
        dataIndex:"address",
        key:"address"},
      {title:"Postal Code",
        dataIndex:"postalcode",
        key:"postal"},
      {title:"City",
        dataIndex:"city",
        key:"city"},
      {title:"Region",
        dataIndex:"region",
        key:"region",
        render:(data) => {
            let regionName = regions.filter(region => region.id == data);
          return(
            <div>
               {data}
            </div>
          )
        }},
        {title:"Edit",
       render:(data) => {
        return(
          <Button icon={<EditFilled />} onClick={() => {setFormData(<EditAddress regionList={regions} display={contractor} address={data} close={closeForm}/>);setShowModal(true)}}/>
        )
       }  
        }
    ]
      }
      else return [
        {title:'Contractor Contact',
          dataIndex:'contractName',
          key:"contractName"},
        {title:"Contrator Phone",
        dataIndex:'contractPhone',
        key:'contractPhone'},
        {title:"Address",
        dataIndex:"address",
        key:"address"},
      {title:"Postal Code",
        dataIndex:"postalcode",
        key:"postal"},
      {title:"City",
        dataIndex:"city",
        key:"city"},
      {title:"Region",
        dataIndex:"region",
        key:"region",
        render:(data) => {
            let regionName = regions.filter(region => region.id == data);
          return(
            <div>
               {data}
            </div>
          )
        }
      },
      {title:"Edit",
       render:(data) => {
        return(
          <Button icon={<EditFilled />} onClick={() => {setFormData(<EditAddress regionList={regions} display={contractor} address={data} close={closeForm}/>);setShowModal(true)}}/>
        )
       }  
        }
      ]
      }

    if(customerInfo !== [] && addressList !== [] && regions !== [])
      return(
        <div>
          <Card
          title = {title}
          >
            <div>
              <div style={{float:"left", width:"30%"}}>
              <Card title="Customer Information">
              <table>
                <tr>
                  <td>
                    First Name:
                  </td>
                  <td>
                    {customerInfo.firstName}
                  </td>
                </tr>
                <tr>
                  <td>
                    Last Name:
                  </td>
                  <td>
                    {customerInfo.lastName}
                  </td>
                </tr>
                <tr>
                  <td>
                    Email:
                  </td>
                  <td>
                    {customerInfo.email}
                  </td>
                </tr>
                <tr>
                  <td>
                    Phone:
                  </td>
                  <td>
                    {customerInfo.phone}
                  </td>
                </tr>
              </table>
            <br />      
        </Card>
        <Card title="Billing Address">
          <table>
            <tr>
              <td>
                Billing Address:
              </td>
              <td>
                {customerInfo.billing}
              </td>
            </tr>
            <tr>
              <td>
                City:
              </td>
              <td>
                {customerInfo.city}
              </td>
            </tr>
            <tr>
              <td>
                Postal Code:
              </td>
              <td>
                {customerInfo.postal}
              </td>
            </tr>
          </table>
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
                    
                    <td style={{position:"sticky", top:"0", width:"25%", backgroundColor:"white"}}>
                      <strong>Date Added</strong>
                    </td>
                    <td style={{position:"sticky", top:"0", width:"10%", backgroundColor:"white"}}>
                      <strong>User Initial</strong>
                    </td>
                    <td style={{position:"sticky", top:"0", width:"10%", backgroundColor:"lightgrey"}}>
                      <strong>Delete</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {getNoteTable()}
                </tbody>
              </table>
              </Item>
              
              <Item>
                <textarea
                id='notes2'
                rows="3"
                cols="75">
                </textarea>
              </Item>
              <Item>
                <Button
                onClick={async() => {
                  let box2 = document.getElementById("notes2");
                  await addNotes(box2.value, user, match)
                  .then(async(item) => {
                    box2.value = "";
                    if(item.status === 200){
                    message.success("added new note");
                   setCount(count + 1);
                  }
                  else{
                    message.error("Something went wrong. Please try again.");
                  }        });
                }}>
                Submit
                </Button>
              </Item>
              
            </div>
            </div>
        <Table
        title={()=>"Addresses"}
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        bordered
        dataSource={addressList}
        columns={columns()}
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
          <Table
          title={()=> "Quotes"}
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        bordered
        dataSource={QandOlist}
        columns={columns2}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>

          </Table>
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
                <div style={{display:contractor}}>
                <Item
                label="Contractor Name"
                name="contractorName">
                  <Input />
                </Item>
                <Item
                label="Contractor Phone"
                name="contractorPhone">
                  <Input />
                </Item>
                </div>
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
        <Modal
        footer={false}
        visible={showModal}
        onCancel={closeForm}
        destroyOnClose={true}>
            {formData}
        </Modal>
        </div>
      )
      else {
        return (
          <div>Loading...</div>
        )
      }
    }

    export default withRouter(CustomerInfo)