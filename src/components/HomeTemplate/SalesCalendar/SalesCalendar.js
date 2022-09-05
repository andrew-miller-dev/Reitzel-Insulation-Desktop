import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Legend from '../../Legend'
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import SalesTemplate from './SalesTemplate.js'
import SalesTooltip from './salesTooltip.js';
import {getEstimates,
        deleteEstimate, 
        getUsersWithDisplay, 
        updateEstimate, 
        getRegionAPI, 
        sendUpdate, 
        addNewCustomer, 
        addNewAddress, 
        addEstimate, 
        sendConfirm, 
        getCustomers,
        getAddressList} from '../../../api/calendar';
import { getCustomer } from "../../../api/customer.js";
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal, Space } from 'antd';
import UpdateConfirm from '../../Email_Templates/updateConfirm';
import {renderEmail} from 'react-html-email';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import { customer_info_sheet } from "../../../assets/paths.js";
import Confirmation from "../../Email_Templates/confirmation.js";
import { Autocomplete, CheckBox, Form, Popup, SelectBox, TextArea, TextBox, Button, TagBox } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { jobs } from "../../../util/storedArrays.js";
import NewEstimateForm from "../../Forms/newestimateform";
const { confirm } = Modal;
const { format, zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

const dataSource = new CustomStore({
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
      values.startDate = format(values.startDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      values.endDate = format(values.endDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      let customerInfo = await addNewCustomer(values);
      const customerID = customerInfo.data.insertId;
      let addressInfo = await addNewAddress(customerID, values);
      const addressID = addressInfo.data.insertId;
      const addEstimates = await addEstimate(
        customerID,
        addressID,
        values);
        message.success("New estimate added");
        let customer = {
          FirstName:values.firstName,
          LastName:values.lastName
        }
        let estimate = {
          JobType:values.jobType,
          startDate:values.startDate
        }
      sendConfirm(values.email, renderEmail(<Confirmation customerInfo = {customer} estimateInfo = {estimate} />), customer_info_sheet);
      return addEstimates;
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

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','week', 'workWeek','month'];
const groups = ['UserID'];

const renderResourceCell = (model) => {
  return (
      <b>{model.data.FirstName} {model.data.LastName[0]}</b>
  );
}
const onAppointmentDeleting = (e) => {
  var cancel = true;
  e.cancel = cancel;
  confirm({title:"Do you want to delete this appointment?", onOk(){dataSource.remove(e.appointmentData.EstimateID) }, onCancel(){cancel = true}});
}

class SalesCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      mounted:false,
      groupByDate:false,
      useExisting:false,
      userList:"",
      regionList:"",
      info:false,
      findCustomerList:[],
      customerAddresses:[],
      showForm:false,
      clickedSalesman:"",
      siteID:"",
      custID:"",
      apptDates:{
        start:"",
        end:""
      },
      basicInfo:{
        firstName:"",
        lastName:"",
        phone:"",
        email:"",
        billingAddress:"",
        billingCity:"",
        billingPostal:"",
        billingRegion:""
      },
      siteInfo:{
        siteAddress:"",
        siteCity:"",
        siteProv:"",
        sitePostal:"",
        siteRegion:"",
        },
      appointmentInfo:{
        startDate:"",
        endDate:"",
       },
      description:"",
      jobType:"",
      formOption:{}
    };
    
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.salesmanSource = this.salesmanSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.createUserObj = this.createUserObj.bind(this);
  }
  async InfoIsHere() {
  if(this.mounted){
    let customerData = await getCustomers();
  let regionData = await this.regionSource();
  let userData = await this.salesmanSource();
  this.setState({userList:userData});
  this.setState({regionList:regionData});
  this.setState({findCustomerList:customerData.data});
  this.setState({info:true});
  }
  
} 
async onAppointmentForm (e) {
  e.cancel = true;
  //console.log(e.appointmentData)
  this.setState({formOption:<NewEstimateForm start={e.appointmentData.startDate} end = {e.appointmentData.endDate} salesman = {this.createUserObj(e.appointmentData.UserID)} />});
  this.setState({showForm:true});
}

createUserObj = (id) => {
  let obj = {id:null,name:null}
  this.state.userList.forEach(element => {
    if(element.id == id) {
      obj = {id:element.id,
              name:element.FirstName}
    }
  });
  return obj;
}


  onGroupByDateChanged(args) {
    this.setState({
      groupByDate: args.value
    });
  }
  async regionSource() {
    const data = await getRegionAPI();
    let regionData = data.data.map((item) => ({
      id  : item.RegionID,
      region: item.Region,
      color: item.color
    }))
    return regionData;
  }

  async salesmanSource() {
    const data = await getUsersWithDisplay();
    let salesData = data.data.map((item) => ({
      id: item.UserID,
      FirstName : item.FirstName,
      LastName: item.LastName
    }))
    return salesData;
  }
  componentDidMount(){
    this.mounted = true;
    this.InfoIsHere();

}
 
  componentWillUnmount(){
    this.mounted = false;
  }
  render() {
    if (this.state.info === false){
        return (
          <p>Loading information...</p>
        )
      }
      else{

      
    return (
      
      <div>
      <Scheduler
        timeZone="America/Toronto"
        groups = {groups}
        groupByDate={this.state.groupByDate}
        resourceCellRender={renderResourceCell}
        dataSource={dataSource}
        views={views}
        defaultCurrentView="workWeek"
        defaultCurrentDate={date}
        height={600}
        startDayHour={7}
        endDayHour={19}
        appointmentComponent={SalesTemplate}
        appointmentTooltipComponent={SalesTooltip}
        onAppointmentDeleting={onAppointmentDeleting}
        onAppointmentFormOpening={this.onAppointmentForm}
        >
        <Resource
          dataSource={this.state.userList}
          fieldExpr="UserID"
          >
        </Resource>
        <Resource
          dataSource={this.state.regionList}
          fieldExpr="RegionID"
          useColorAsDefault={true}
        ></Resource>
        </Scheduler>
        <div className="options" style={{display:'flex'}}>
        <Space>
          <div className="caption">Group by Date First <br/><Switch
            value={ this.state.groupByDate }
            onValueChanged={this.onGroupByDateChanged}
          />
        </div>
        <div className="option">
          Show Legend <br />
          <Button
          text="Show"
          type="default"
          height={25}
          stylingMode="outlined"
          onClick={() => {
            Modal.info({
              content:<Legend />
            })
          }} />
        </div>
        </Space> 
      </div>
      <Modal
      footer={false}
      destroyOnClose={true}
      visible={this.state.showForm}
      onCancel={() => {this.setState({showForm:false})}}
      width="75%">
        {this.state.formOption}
      </Modal>
    </div>
    );
  }
}
}

export default SalesCalendar;