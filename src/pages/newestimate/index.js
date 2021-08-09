import React, { useEffect, useState } from "react";
import { Form, DatePicker, Input, Button, Select, message, Card, Modal } from "antd";
import {
  addOrder,
  addEstimate,
  getLatestCustomer,
  addAddress,
  getLatestAddress,
} from "../../api/neworder";
import SalesSnapshot from '../../Components/HomeTemplate/SalesCalendar/SalesSnapshot'
import { getRegionAPI, getUsers, sendConfirm } from "../../api/calendar";
import "./index.css";
import TextArea from "antd/lib/input/TextArea";
import Confirmation from "../../Components/Email_Templates/confirmation"
import {renderEmail} from 'react-html-email';
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
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const options = regions.map((item) => (
    <Option key={item.id}>{item.region}</Option>
  ));
  const jobs = ["loosefill", "spray"];
  const options1 = jobs.map((item, index) => (
    <Option key={item}>{item}</Option>
  ));

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
      BillingAddress: values.BillingAddress,
      City: values.City,
      Prov: values.Prov,
      PostalCode: values.PostalCode,
      Region: values.Region,
    };
    var siteAddress = {
      BillingAddress: values.siteAddress,
      City: values.siteCity,
      Prov: values.siteProv,
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
    var result = await addOrder(customer);

    if (result.status == 200) {
      message.success("add success!");
    } else message.warn("fail");
    var getCustomerID = await getLatestCustomer();
    var latestCustomer = getCustomerID.data[0].CustomerID;
    if(customer.BillingAddress !== undefined){
          var newAddress = await addAddress(latestCustomer, customer);
    }
    if (siteAddress.BillingAddress !== undefined) {
      var siteAddressSent = await addAddress(latestCustomer, siteAddress);
    }
    var getAddressID = await getLatestAddress();
    var latestAddress = getAddressID.data[0].CustomerID;
    var estimateResult = await addEstimate(
      latestCustomer,
      getAddressID.data[0].AddressID,
      estimate
    );
    sendConfirm(customer.Email, renderEmail(<Confirmation customerInfo = {customer} siteInfo = {siteAddress} estimateInfo = {estimate}  />))
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
                  message: "Cannot be Empty",
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
                  message: "Cannot be Empty",
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
                  message: "Cannot be Empty",
                },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Item>
            <Item label="Email Address" name="Email">
              <Input defaultValue=" " />
            </Item>
            <Item label="Site Address" name="siteAddress"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}>
              <Input placeholder="Address" />
            </Item>
            <Item label="Site City" name="siteCity"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}>
              <Input placeholder="City" />
            </Item>
            <Item label="Site Province" name="siteProv"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}>
              <Input placeholder="Province" />
            </Item>
            <Item label="Postal Code" name="sitePostal"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}>
              <Input placeholder="Postal Code" />
            </Item>
            <Item name="siteRegion" label="Site Region"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
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
            <Input defaultValue=" " />
            </Item>
            <Item
              label="City"
              name="City"
            >
              <Input defaultValue=" " />
            </Item>
            <Item
              label="Province"
              name="Prov"
            >
              <Input defaultValue=" " />
            </Item>
            <Item
              label="Postal Code"
              name="PostalCode"
            >
              <Input defaultValue=" " />
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
                  message: "Cannot be Empty",
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
                  message: "Cannot be Empty",
                },
              ]}
            >
              <Select>{options1}</Select>
            </Item>
            <Item
              label="Information"
              name="EstimateInfo"
              rules={[
                {
                  required: true,
                  message: "Cannot be Empty",
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
                  message: "Cannot be Empty",
                },
              ]}
            >
              <Select>{options2}</Select>
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