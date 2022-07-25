import React, { useEffect, useState } from "react";
import validator from "validator";
import { useSelector } from "react-redux";
import { Form, DatePicker, Input, Button, Select, message, Card, Modal, AutoComplete } from "antd";
import {
  addCustomer,
  addEstimate,
  addAddress,
} from "../api/neworder";
import SalesSnapshot from './HomeTemplate/SalesCalendar/SalesSnapshot';
import { getRegionAPI, getUsers, sendConfirm, getAddressList, getCustomers } from "../api/calendar"
import TextArea from "antd/lib/input/TextArea";
import Confirmation from "./Email_Templates/confirmation"
import {renderEmail} from 'react-html-email';
import { customer_info_sheet } from "../assets/paths";
import { jobs } from "../util/storedArrays";
import { useHistory } from "react-router-dom";
import { getAddress } from "../api/addresses";
const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { format } = require("date-fns-tz");

export default function EstimateForm(props) {
  const [info, setInfo] = useState(false);
  const [salesmen, setSalesmen] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form] = Form.useForm();
  const [showCalendar, setShowCalendar] = useState(false);
  const [customerSelect, setCustomerSelect] = useState([]);
  const [addressSelect, setAddressSelect] = useState([]);
  const history = useHistory();
  const selectCustomer = useSelector((state) => state.customerReducer.newEstimate);
  const selectAddress = useSelector((state) => state.addressReducer.currentAddress);
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const options1 = jobs.map((item) => (
    <Option key={item}>{item}</Option>
  ));

  const options2 = salesmen.map((item) => (
    <Option key={item.id}>{item.FirstName}</Option>
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

  const onFinish = async (values) => {
    let customer = selectCustomer;
    const addressInfo = await getAddress(selectAddress);
    const start = format(values.selectedDate[0]._d,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    const end = format(values.selectedDate[1]._d,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    var estimate = {
      UserID: values.salesman,
      JobType: values.JobType,
      Region: values.siteRegion,
      startDate: start,
      endDate: end,
      estimateInfo: values.EstimateInfo,
    };
      var estimateResult = await addEstimate(
            customer.CustomerID,
           selectAddress,
            estimate
          );
          if (estimateResult.status === 200) {
            message.success("Added new estimate");
          } 
          else message.warn("Something went wrong");
  /*
    if(validator.isEmail(customer.Email)){
      sendConfirm(customer.Email, renderEmail(<Confirmation customerInfo = {customer} siteInfo = {addressInfo[0].data} estimateInfo = {estimate}  />), customer_info_sheet)
    }
    */
    history.push("/home");
  };

  useEffect(() => {

    getsalesmen();
    getregions();

    if (salesmen !== [] && regions !== [] ) {
      setInfo(true);
    }
  }, [selectCustomer]);
  if (info !== true) {
    return <p>Loading Information...</p>;
  } else {
    return (
      <div className="neworder">
        <h3>Estimate</h3>
        <Card>
          <Form form={form} onFinish={onFinish} {...layout}>
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
                className="datepicker"
              />
              
            </Item>
            <Item
            label="Calendar">
            <Button type="primary" onClick={() => {setShowCalendar(true)}}>Show Calendar</Button>
            </Item>
            <Item
              name="JobType"
              label="Job Type"
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
              label="Job Info"
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
              label="Salesman"
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