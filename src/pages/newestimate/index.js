import React, { useEffect, useState } from "react";
import validator from "validator";
import { Form, DatePicker, Input, Button, Select, message, Card, Modal } from "antd";
import {
  addCustomer,
  addEstimate,
  addAddress,
} from "../../api/neworder";
import SalesSnapshot from '../../Components/HomeTemplate/SalesCalendar/SalesSnapshot'
import { getRegionAPI, getUsers, sendConfirm } from "../../api/calendar";
import "./index.css";
import TextArea from "antd/lib/input/TextArea";
import Confirmation from "../../Components/Email_Templates/confirmation"
import {renderEmail} from 'react-html-email';
import { customer_info_sheet } from "../../assets/paths";
import { jobs } from "../../util/storedArrays";
const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { format } = require("date-fns-tz");


export default function NewEstimate(props) {
  const [info, setInfo] = useState(false);
  const [salesmen, setSalesmen] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form] = Form.useForm();
  const [showCalendar, setShowCalendar] = useState(false);
  const [validEmail, setValidEmail] = useState('');
  const [errorColor, setErrorColor] = useState('red');
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const options = regions.map((item) => (
    <Option key={item.id}>{item.region}</Option>
  ));
  const options1 = jobs.map((item, index) => (
    <Option key={item}>{item}</Option>
  ));

  const emailCheck = (value) => {
    let word = value.target.value;
    if(validator.isEmail(word)){
      setValidEmail('Valid email');
      setErrorColor('green');
    }
    else {
      setValidEmail('Not a valid email');
      setErrorColor('red');
    }
  }

  const getregions = async () => {
    const data = await getRegionAPI();
    let regionData = data.data.map((item) => ({
      id: item.RegionID,
      region: item.Region,
      color: item.color,
    }));
    setRegions(regionData);
  };

  const getsalesmen = async () => {
    const data = await getUsers();
    let salesData = data.data.map((item) => ({
      id: item.UserID,
      FirstName: item.FirstName,
      LastName: item.LastName,
    }));
    setSalesmen(salesData);
  };

  const options2 = salesmen.map((item) => (
    <Option key={item.id}>{item.FirstName}</Option>
  ));

  const onFinish = async (values) => {

    var customer = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Phone: values.Phone,
      Email: values.Email,
      BillingAddress: values.BillingAddress || ' ',
      City: values.City || ' ',
      PostalCode: values.PostalCode || ' ',
      Region: values.Region || ' ',
    };
    var siteAddress = {
      BillingAddress: values.siteAddress,
      City: values.siteCity,
      PostalCode: values.sitePostal,
      Region: values.siteRegion
    };
    var estimate = {
      UserID: values.salesman,
      JobType: values.JobType,
      Region: values.siteRegion,
      startDate: format(
        values.selectedDate[0]._d,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      endDate: format(
        values.selectedDate[1]._d,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      estimateInfo: values.EstimateInfo,
    };

    let customerInfo = await addCustomer(customer);
    var latestCustomer = customerInfo.data.insertId;
    if(customer.BillingAddress !== ' ') {
           await addAddress(latestCustomer, customer);
    }
          let addressResult = await addAddress(latestCustomer, siteAddress);
          let addressID = addressResult.data.insertId;
           var estimateResult = await addEstimate(
            latestCustomer,
            addressID,
            estimate
          );
          if (estimateResult.status === 200) {
            message.success("Added new estimate");
          } 
          else message.warn("Something went wrong");
    if(validator.isEmail(customer.Email)){
      sendConfirm(customer.Email, renderEmail(<Confirmation customerInfo = {customer} siteInfo = {siteAddress} estimateInfo = {estimate}  />), customer_info_sheet)
    }
    props.history.push("/home");
  };

  useEffect(() => {
    getsalesmen();
    getregions();
    if (salesmen != [] && regions != []) {
      setInfo(true);
    }
  }, []);
  if (info != true) {
    return <p>Loading Information...</p>;
  } else {
    return (
      <div className="neworder">
        <Card>
          <Form form={form} onFinish={onFinish} {...layout}>
            <Item
              label="First Name"
              name="FirstName"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <Input placeholder="First Name" />
            </Item>
            <Item
              label="Last Name"
              name="LastName"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Item>
            <Item
              label="Phone"
              name="Phone"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Item>
            <Item
             label="Email Address" 
             name="Email"
             rules={[
              {
                required: true,
                message: "Required Field",
              },
            ]}
             >
              <Input
              onChange={emailCheck} />
              
            </Item>
            <Item
            label="Email Check">
              <span 
              style={{
                fontSize:12,
                color:errorColor
              }}>
          {validEmail}
          </span>
            </Item>
            <Item label="Site Address" name="siteAddress"
            rules={[
              {
                required: true,
                message: "Required Field",
              },
            ]}>
              <Input placeholder="Address" />
            </Item>
            <Item label="Site Postal Code" name="sitePostal"
            rules={[
              {
                required:true,
                message:"Required field"
              }
            ]}>
              <Input placeholder="Postal Code" />
            </Item>
            <Item label="Site City" name="siteCity"
            rules={[
              {
                required: true,
                message: "Required Field",
              },
            ]}>
              <Input placeholder="City" />
            </Item>
            <Item name="siteRegion" label="Site Region"
            rules={[
              {
                required: true,
                message: "Required Field",
              },
            ]}>
              <Select>{options}</Select>
            </Item>
            <i>optional billing address</i><br/>
            <i>---</i>
            <Item
              label="Billing Address"
              name="BillingAddress" 
            >
            <Input />
            </Item>
            <Item
              label="City"
              name="City"
            >
              <Input />
            </Item>
            <Item
              label="Postal Code"
              name="PostalCode"
            >
              <Input />
            </Item>
            <Item
              name="Region"
              label="Region"
            >
              <Select>{options}</Select>
            </Item>
            <i>---</i>
            <Item
              name="selectedDate"
              label="Time"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                className="datepicker"
              />
              
            </Item>
            <Item
            label="Calendar">
            <Button type="primary" onClick={() => {setShowCalendar(true)}}>Show Calendar</Button>
            </Item>
            <Item
              name="JobType"
              label="Type of Job"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <Select
              mode="multiple">{options1}</Select>
              
            </Item>
            <Item
              label="Information"
              name="EstimateInfo"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Estimate Information" />
            </Item>
            <Item
              name="salesman"
              label="Assigned Salesman"
              rules={[
                {
                  required: true,
                  message: "Required Field",
                },
              ]}
            >
              <Select
              >{options2}</Select>
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
                block
              >
                Create Estimate
              </Button>
            </Item>
          </Form>
        </Card>
        <Modal
        visible={showCalendar}
        onCancel={() => {setShowCalendar(false)}}
        width="90%"
        >
        <SalesSnapshot />
      </Modal>
      </div>
      
    );
  }
}