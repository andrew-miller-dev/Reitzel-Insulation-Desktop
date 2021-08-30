import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import SalesTemplate from './SalesTemplate.js'
import SalesTooltip from './salesTooltip.js';
import {getEstimates, deleteEstimate, getUsers, updateEstimate, getRegionAPI, sendUpdate, findCustomer, addNewCustomer, addNewAddress, getLatestCustomer, getLatestAddress, addEstimate} from '../../../api/calendar';
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal } from 'antd';
import UpdateConfirm from '../../Email_Templates/updateConfirm';
import {renderEmail} from 'react-html-email';
import 'devextreme-react/tag-box';
import { getAddress, getCustomer } from "../../../api/addresses.js";
const { confirm } = Modal;

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
      startDate : item.startDate,
      endDate : item.endDate
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
      startDate : values.startDate,
      endDate : values.endDate
  }
    const check = await updateEstimate(key, formatData);
    return check;
  },
  remove: async(key) => {
    const data = await deleteEstimate(key);
    return data
  },
  insert: async (values) => {
    console.log('values', values);
    try{
      const addCustomer = await addNewCustomer(values);
      const latestCustomer = await getLatestCustomer();
      const customerID = latestCustomer.data[0].CustomerID;
      const addAddress = await addNewAddress(customerID, values);
      const latestAddress = await getLatestAddress();
      const addressID = latestAddress.data[0].AddressID;
      const addEstimates = await addEstimate(
        customerID,
        addressID,
        values);
        message.success("New estimate added");
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
  console.log(values);
  let findCustomerEmail = await findCustomer(values.CustomerID);
  let customerEmail = findCustomerEmail.data[0];
  sendUpdate(customerEmail.Email, renderEmail(<UpdateConfirm estimateInfo = {values}/>));
}

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','week', 'workWeek','month'];
const groups = ['UserID'];

const renderResourceCell = (model) => {
  return (
      <b>{model.data.FirstName}</b>
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
      groupByDate:false,
      cancel:true,
      userList:"",
      regionList:"",
      info:false
    };
    
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.salesmanSource = this.salesmanSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.getRegionNames = this.getRegionNames.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getRegionID  = this.getRegionID.bind(this);
  }
  async InfoIsHere() {
  let regionData = await this.regionSource();
  let userData = await this.salesmanSource();
  this.setState({userList:userData});
  this.setState({regionList:regionData});
  this.setState({info:true});
} 

async onAppointmentForm (e) {
  
  if(e.appointmentData.CreationDate) {
    e.cancel = true;
  }
  
  else{
  let address = await getAddress(e.appointmentData.AddressID);
  let addressData = address.data;
  let customer = await getCustomer(e.appointmentData.CustomerID);
  let customerData = customer.data;
  let form = e.form;
  e.popup.option('showTitle', true);
  e.popup.option('title', 'Quick appointment creation and editing');
  let user = e.appointmentData.UserID;
  let data = e.appointmentData;
  let newGroupItems =[
  {
    label:{text: "First Name"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"firstName",
  },
  {
    label:{text: "Last Name"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"lastName"
  },
  {
    label:{text:'Phone'},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:'phone'
  },
  {
    label:{text:"Email"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"email",
  },

  {
    label:{text:"Site Address"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"siteAddress"
  },
  {
    label:{text:"Site City"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"siteCity"
  },
  {
    label:{text:"Site Province"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"siteProv"
  },
  {
    label:{text:"Postal Code"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"sitePostal"
  },
  {
    label:{text:"Region"},
    isRequired:true,
    editorType:'dxSelectBox',
    editorOptions:{
      displayExpr:"region",
      valueExpr:"id",
      dataSource: this.state.regionList,
    },
    dataField:'siteRegion'
  },
  {
    label:{text:"Assigned Salesman"},
    editorType: 'dxTextBox',
    editorOptions:{
      value:this.getUserName(user, this.state.userList),
      readOnly:true
    }
  },
  {
    label:{text: "Start Date"},
    colSpan:2,
    editorType:'dxDateBox',
    editorOptions:{type:'datetime', width:'100%'},
    isRequired:true,
    dataField:'startDate'
  },
  {
    label:{text: "End Date"},
    colSpan:2,
    editorType:'dxDateBox',
    editorOptions:{type:'datetime', width:'100%'},
    isRequired:true,
    dataField:'endDate'
  },
  {
    label:{text:"Description"},
    colSpan:2,
    editorType:'dxTextArea',
    isRequired:true,
    dataField:'apptInfo'
  },
  {
    label:{text:"Job Type"},
    colSpan:2,
    isRequired:true,
    editorType:'dxSelectBox',
    editorOptions:{
      items:['loosefill','spray', "fireproofing","removal"]
    },
    dataField:'jobType'
  }
];

  form.itemOption('mainGroup','items', newGroupItems)
}
}

getUserName(id, array){
  let user = '';
  array.map((item) => {
    if(item.id === id) {
      user = item.FirstName + " " + item.LastName;
    }
  })
  return user;
} 

getRegionNames(array) {
  let names = [];
  array.map((item) => {
    names.push(item.region);
  });
  return names;
}
getRegionID(name, array){
  let id = '';
  array.map((item) => {
    if(item.region === name) {
      id = item.FirstName + " " + item.LastName;
    }
  })
  return id;
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
    console.log(regionData);
    return regionData;
  }

  async salesmanSource() {
    const data = await getUsers();
    let salesData = data.data.map((item) => ({
      id: item.UserID,
      FirstName : item.FirstName,
      LastName: item.LastName
    }))
    console.log(salesData);
    return salesData;
  }
  componentDidMount(){
    this.InfoIsHere();
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
        timeZone="America/Edmonton"
        groups = {groups}
        groupByDate={this.state.groupByDate}
        resourceCellRender={renderResourceCell}
        dataSource={dataSource}
        views={views}
        defaultCurrentView="workWeek"
        defaultCurrentDate={date}
        height={800}
        startDayHour={6}
        endDayHour={21}
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
        <div className="options">
        <div className="caption">Group by Date First</div>
        <div className="option">
          <Switch
            value={ this.state.groupByDate }
            onValueChanged={this.onGroupByDateChanged}
          />
        </div>
      </div>
    </div>
    );
  }
}
}

export default SalesCalendar;