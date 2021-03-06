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
    };
    
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.salesmanSource = this.salesmanSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.getUserName = this.getUserName.bind(this);
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
  
  if(e.appointmentData.CreationDate) {
    e.cancel = true;
  }
  
  else{
  let form = e.form;
  e.popup.option('showTitle', true);
  e.popup.option('title', 'Quick appointment creation');
  let user = e.appointmentData.UserID;
  var apptDates = {...this.state.apptDates};
          apptDates.start = format(e.appointmentData.startDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          apptDates.end = format(e.appointmentData.endDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          this.setState({apptDates});
  let newGroupItems =[
    {
      editorType:'dxButton',
      colSpan:2,
      editorOptions:{
        text:'Existing Customer Lookup',
        onClick:() => {
          e.popup.hide();
          this.setState({showForm:true});
          var appointmentInfo = {...this.state.appointmentInfo};
          appointmentInfo.startDate = format(e.appointmentData.startDate,"M/d/yyyy, hh:mm a");
          appointmentInfo.endDate = format(e.appointmentData.endDate,"M/d/yyyy, hh:mm a");
          this.setState({appointmentInfo});
          this.setState({clickedSalesman:e.appointmentData.UserID})
        } 
      },
    },
  {
    label:{text: "First Name"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"firstName"
  },
  {
    label:{text: "Last Name"},
    isRequired:true,
    editorType:'dxTextBox',
    dataField:"lastName",
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
    editorType:'dxTagBox',
    editorOptions:{
      items:jobs
    },
    dataField:'jobType'
  }
];

  form.itemOption('mainGroup','items', newGroupItems);
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
      <Popup
      height='95%'
      title="Existing Customer Appointment Creation"
      visible={this.state.showForm}
      onHiding={() => {this.setState({showForm:false})}}
      >
          <Autocomplete
          dataSource={this.state.findCustomerList}
          valueExpr="CustLastName"
          placeholder="Look up by last name..."
          itemRender={(data) => {
            return (
              <span>{data.CustFirstName} {data.CustLastName}</span>
            )
          }}
          onItemClick={async(data) => {
            var customer = data.itemData
            var basicInfo = {...this.state.basicInfo};
            basicInfo.firstName = customer.CustFirstName;
            basicInfo.lastName = customer.CustLastName;
            basicInfo.phone = customer.Phone;
            basicInfo.email = customer.Email;
            basicInfo.billingAddress = customer.BillingAddress;
            basicInfo.billingCity = customer.CustCity;
            basicInfo.billingPostal = customer.CustPostalCode;
            basicInfo.billingRegion = customer.CustRegion;
            this.setState({basicInfo});
            this.setState({custID:customer.CustomerID})
            let result = await getAddressList(customer.CustomerID);
            this.setState({customerAddresses:result.data});
          }}
          />
          <br/>
        <Form
        formData={this.state.basicInfo}
        colCount={3}

        >
        <Item editorOptions={{readOnly:true}} dataField='firstName' />  
        <Item editorOptions={{readOnly:true}} dataField='lastName' />
        <Item editorOptions={{readOnly:true}} dataField='phone' />
        <Item editorOptions={{readOnly:true}} dataField='email' />  
        <Item editorOptions={{readOnly:true}} dataField='billingAddress' />
        <Item editorOptions={{readOnly:true}} dataField='billingCity' />
        <Item editorOptions={{readOnly:true}} dataField="billingPostal" />
        <Item dataField="billingRegion" 
              editorType="dxSelectBox" 
              editorOptions={{dataSource: this.state.regionList, value:this.state.basicInfo.billingRegion, displayExpr:"region", valueExpr:"id", readOnly:true}} />

        </Form>
        <br />
        <CheckBox
        text="Use Existing Address"
        onValueChanged={() => {
          if(this.state.useExisting === true){
            this.setState({useExisting:false});
          }
          else {
            this.setState({useExisting:true});
          }
          }}
        ></CheckBox>
        <br />
        <SelectBox
          visible={this.state.useExisting}
          dataSource={this.state.customerAddresses}
          itemRender={(data) => {
            return (
              <span>{data.Address}, {data.City} {data.PostalCode}</span>
            )
          }}
          onItemClick={(data) => {
            var address = data.itemData;
            var siteInfo = {...this.state.siteInfo};
            siteInfo.siteAddress = address.Address;
            siteInfo.siteCity = address.City;
            siteInfo.sitePostal = address.PostalCode;
            siteInfo.siteRegion = address.Region;
            this.setState({siteID:address.AddressID});
            this.setState({siteInfo});
          }}
          />
        <br />
        <Form
        colCount={3}
        formData={this.state.siteInfo}
        >
        <Item editorOptions={{readOnly:this.state.useExisting}} dataField='siteAddress' />  
        <Item editorOptions={{readOnly:this.state.useExisting}} dataField='siteCity' />
        <Item editorOptions={{readOnly:this.state.useExisting}} dataField="sitePostal" />
        <Item dataField="siteRegion" 
              editorType="dxSelectBox" 
              editorOptions={{dataSource: this.state.regionList, value:this.state.siteInfo.siteRegion, displayExpr:"region", valueExpr:"id", readOnly:this.state.useExisting}} />
        </Form>
        
        <br/>
        <Form
        col count={2}
        formData={this.state.appointmentInfo}>
        
        </Form>
        Description:
        <TextArea
        onValueChanged={(data) => {
          this.setState({description:data.value});
        }}>

        </TextArea>
        Job Type:
        <TagBox
        onValueChanged={(data) => {
          this.setState({jobType:data.value});
        }}
        items={jobs}>
        </TagBox>
        Assigned Salesman:
        <TextBox
        readOnly={true}
        value={this.getUserName(this.state.clickedSalesman, this.state.userList)}>
        </TextBox>
        <br />
        <div style={{float:"right"}}>
        <Space>
        <Button
        style={{fontSize:"14px",padding:"7px 15px 7px 15px"}}
        onClick={(e) => {
          let func = async() => {
                let info = {
                  UserID:this.state.clickedSalesman,
                  jobType:this.state.jobType,
                  apptInfo:this.state.description,
                  siteRegion:this.state.siteInfo.siteRegion,
                  startDate:this.state.apptDates.start,
                  endDate:this.state.apptDates.end
               }
               if(this.state.useExisting){
              let result = await addEstimate(this.state.custID, this.state.siteID, info);
              this.setState({showForm:false});
              if(result.status === 200){
                message.success("Added new estimate");
              }
          }
          
          else {
            let result = await addNewAddress(this.state.custID, this.state.siteInfo);
            if(result.status === 200){
              let address = result.data.insertId;
              let final = await addEstimate(this.state.custID, address, info);
              this.setState({showForm:false});
              if(final.status === 200) {
                message.success("Added new address and estimate");
              }
            }
            else{
              message.warn("Something went wrong");
            }
          }
          
          }
        func().then(() => {
          dataSource.load();
        })
        
        }}
        >Done</Button>
        <Button
         style={{fontSize:"14px",padding:"7px 15px 7px 15px"}}
         onClick={() => {
           this.setState({showForm:false})}}>
          Cancel
        </Button>
        </Space>
        </div>
      </Popup>
      
    </div>
    );
  }
}
}

export default SalesCalendar;