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
import UpdateConfirm from '../Components/Email_Templates/updateConfirm'
import validator from "validator";

//import file from "/How_to_Prepare_for_Your_Free_Insulation_Estimation.pdf";

const { confirm } = Modal;
const { format, zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");
const path = require("path");

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
      //var link = "/public/insulation.pdf"
      //var pdf = "C:\Users\amill\Reitzel Desktop GitHub\Reitzel-Insulation-Desktop\public\insulation.pdf";
      //var blob = new Blob([link], {type:'application/pdf'});
      //var reader = new FileReader();
      //var pdf = URL.createObjectURL(blob);
      sendConfirm(customer.Email, renderEmail(<Confirmation customerInfo = {customer} siteInfo = {addressInfo.data[0]} estimateInfo = {values}  />))
    }
    return estimateResult;
      }
      catch(e){
        console.log(e);
      }
    },
    onUpdating: (key, values) => {
      confirm({title:"Send email update to customer?", onOk() {sendEmailUpdate(values)}, cancelText:"No"})
    },
    onInserted:(values) => {
    }
  });

  const sendEmailUpdate = async (values) => {
    let findCustomerEmail = await getCustomer(values.CustomerID);
    let customerEmail = findCustomerEmail.data[0];
    sendUpdate(customerEmail.Email, renderEmail(<UpdateConfirm estimateInfo = {values}/>));
    message.success("Email sent to customer");
  }