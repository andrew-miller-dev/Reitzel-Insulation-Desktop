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
import { CheckForExisting } from "../../config/checks";
import EstimateForm from "../../Components/EstimateForm";
const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { format } = require("date-fns-tz");


export default function NewEstimate(props) {
  return(

  
  <EstimateForm />
  )
}