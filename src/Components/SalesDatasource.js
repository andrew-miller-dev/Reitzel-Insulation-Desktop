import {getEstimates,
    deleteEstimate, 
    updateEstimate, 
    sendUpdate, 
    addEstimate, 
    sendConfirm} from "../api/calendar";
import { getCustomer } from "../api/customer";
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal} from 'antd';
import { renderEmail } from "react-html-email";
import Confirmation from "./Email_Templates/confirmation";
import { customer_info_sheet } from "../assets/paths";
import UpdateConfirm from '../Components/Email_Templates/updateConfirm'
import validator from "validator";


const { confirm } = Modal;
const { format, zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");


export const dataSource = new CustomStore({
    key: "EstimateID",
    load: async () => {
      const data = await getEstimates();
      let formatData = data.data.map((item) => ({
        EstimateID : item.EstimateID,
        CustomerID : item.CustomerID,
        AddressID : item.AddressID,
        UserID : item.UserID,
        CreationDate : item.CreationDate,
        text : item.EstimateInfo,
        JobType:item.JobType,
        RegionID : item.RegionID,
        startDate : utcToZonedTime(item.startDate),
        endDate : utcToZonedTime(item.endDate)
      }));
      return formatData
    },
    update: async (key, values) => {
      let formatData = {
        EstimateID : values.EstimateID,
        CustomerID : values.CustomerID,
        AddressID : values.AddressID,
        UserID : values.UserID,
        CreationDate : values.CreationDate,
        EstimateInfo : values.EstimateInfo,
        RegionID : values.RegionID,
        startDate : format(zonedTimeToUtc(values.startDate),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        endDate : format(zonedTimeToUtc(values.endDate),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    }
      const check = await updateEstimate(key, formatData);
      return check;
    },
    remove: async(key) => {
      const data = await deleteEstimate(key);
      return data
    },
    insert: async (values) => {
        console.log(values);
      try{
        let customer = values.customerInfo;
        let addressInfo = values.addressInfo;
        var estimateResult = await addEstimate(
            values.customerID,
            values.addressID,
            values
          );
          if (estimateResult.status === 200) {
            message.success("Added new estimate");
          } 
          else message.warn("Something went wrong");
  
    if(validator.isEmail(customer.Email)){
      sendConfirm(customer.Email, renderEmail(<Confirmation customerInfo = {customer} siteInfo = {addressInfo.data[0]} estimateInfo = {values}  />), customer_info_sheet)
    }
    return estimateResult;
      }
      catch(e){
        console.log(e);
      }
    },
    onUpdating: (key, values) => {
      
      confirm({title:"Send email update to customer?", onOk() {sendEmailUpdate(values)}, cancelText:"No"})
    }
  });

  const sendEmailUpdate = async (values) => {
    let findCustomerEmail = await getCustomer(values.CustomerID);
    let customerEmail = findCustomerEmail.data[0];
    sendUpdate(customerEmail.Email, renderEmail(<UpdateConfirm estimateInfo = {values}/>), customer_info_sheet);
    message.success("Email sent to customer");
  }