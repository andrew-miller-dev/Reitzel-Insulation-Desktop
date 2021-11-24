import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import FillTemplate from './FillTemplate.js';
import FillTooltip from './FillTooltip';
import {getWorkOrders,
        deleteEstimate, 
        getUsers, 
        getRegionAPI, 
        sendUpdate, 
        addNewCustomer, 
        addNewAddress, 
        addEstimate, 
        sendConfirm, 
        getCustomers,
        getDetailsByID,
        getProductsByID,
        updateWorkOrder,
        getCustomerQuotes,
        getQuoteDetails,
        getQuoteProducts} from '../../../api/calendar';
import { getCustomer } from "../../../api/customer.js";
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal, Space } from 'antd';
import UpdateConfirm from '../../Email_Templates/updateConfirm';
import {renderEmail} from 'react-html-email';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import { customer_info_sheet } from "../../../assets/paths.js";
import Confirmation from "../../Email_Templates/confirmation.js";
import { Autocomplete, CheckBox, Form, Popup, SelectBox, TextArea, TextBox, Button, List } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { getTrucks } from "../../../api/trucks.js";
const { confirm } = Modal;
const { format } = require("date-fns-tz");

const dataSource = new CustomStore({
  key: "WorkOrderID",
  load: async () => {
    const data = await getWorkOrders();
    let formatData = data.data.map((item) => ({
      WorkOrderID:item.WorkOrderID,
      CustomerID:item.CustomerID,
      AddressID:item.AddressID,
      TruckID:item.TruckID,
      UserID:item.UserID,
      RegionID:5,
      type:item.WorkType,
      total:item.TotalAmount,
      startDate:item.startDate,
      endDate:item.endDate,
      details:async function() {
        let detailArr = await getDetailsByID(item.WorkOrderID);
        let detArr = detailArr.data.map((det) => (
          {
            DetailID:det.WODetailID,
            OrderID: det.OrderID,
            text:det.Details,
            subtotal:det.DetailTotal,
            products:async function() {
              let productArr = await getProductsByID(det.WODetailID);
              let prodArr = productArr.data.map((prod) => (
                {
                  ProductID:prod.WOProdID,
                  OrderID:prod.OrderID,
                  DetailID:prod.WODetailID,
                  product:prod.Product,
                  notes:prod.Notes,
                  proce:prod.Price
                }
              ));
              return prodArr;
            }
          }
        ));
        return detArr;
      }
     }));
    return formatData;
  },
  update: async (key, values) => {
    let formatData = {
      TruckID: values.TruckID,
      startDate : values.startDate,
      endDate : values.endDate
  }
    const check = await updateWorkOrder(key, formatData);
    return check;
  },
  remove: async(key) => {
    const data = await deleteEstimate(key);
    return data
  },
  insert: async (values) => {
    try{
      let customerInfo = await addNewCustomer(values);
      console.log(customerInfo);
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
}

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','week', 'workWeek','month'];
const groups = ['TruckID'];

const renderResourceCell = (model) => {
  return (
      <b>Truck {model.data.TruckNumber} {model.data.TruckInfo}</b>
  );
}
const onAppointmentDeleting = (e) => {
  var cancel = true;
  e.cancel = cancel;
  confirm({title:"Do you want to delete this work order?", onOk(){dataSource.remove(e.appointmentData.EstimateID) }, onCancel(){cancel = true}});
}

class FillCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state={

      groupByDate:false,
      userList:"",
      regionList:"",
      truckList:"",
      info:false,
      findCustomerList:[],
      showForm:false,
      clickedTruck:"",
      custInfo:[],
      custQuotes:[],
      mounted:false,
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
    this.truckSource = this.truckSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.getUserName = this.getUserName.bind(this);
  }
  async InfoIsHere() {
    if(this.mounted === true){
  let customerData = await getCustomers();
  let regionData = await this.regionSource();
  let truckData = await this.truckSource();
  this.setState({regionList:regionData});
  this.setState({findCustomerList:customerData.data});
  this.setState({truckList:truckData});
  this.setState({info:true});
    }
} 

async onAppointmentForm (e) {
  
  if(e.appointmentData.total) {
    e.cancel = true;
  }
  
  else{
  let form = e.form;
  e.popup.option('showTitle', true);
  e.popup.option('title', 'Quick work order creation');
  let newGroupItems =[
    {
      label:{text:"Lookup by Customer"},
      colSpan:2,
      editorType:"dxAutocomplete",
      editorOptions:{
        dataSource:this.state.findCustomerList,
          valueExpr:"CustLastName",
          placeholder:"Look up by last name...",
          itemRender:(data) => {
            return (
              <span>{data.CustFirstName} {data.CustLastName}</span>
            )
          },
          onItemClick:async(data) => {
            this.setState({custInfo:data.itemData});
            let listQuotes = await getCustomerQuotes(data.itemData.CustomerID);
            let quoteList = listQuotes.data.map((item) => (
              {
                id:item.QuoteID,
                AddressID:item.AddressID,
                CustomerID:item.CustomerID,
                UserID:item.UserID,
                total:item.QuoteTotal,
                customerNotes:item.notesCustomers,
                installerNotes:item.notesInstallers,
                creationDate:item.creationDate,
                completed:item.completed,
                detailArr:async() => {
              let details = await getQuoteDetails(item.QuoteID);
              let detailsArr = details.data.map((det) => (
                {
                  id:det.SubtotalID,
                  quoteID:det.quoteID,
                  subtotal:det.subtotalAmount,
                  details:det.subtotalLines,
                  productArr:async() => {
                    let products = await getQuoteProducts(det.SubtotalID);
                    let productArr = products.data.map((prod) => (
                      {
                        id:prod.QuoteLineID,
                        subtotalID:prod.subtotalID,
                        quoteID:prod.QuoteID,
                        product:prod.Product,
                        notes:prod.Notes,
                        price:prod.Subtotal
                      }
                    ))
                    return productArr;
                }}))
              return detailsArr;
            }}));

            this.setState({custQuotes:quoteList});
            this.setState({showForm:true});
            console.log(this.state.custQuotes);
          }
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
  }
];

  form.itemOption('mainGroup','items', newGroupItems);
}
}

getUserName(id, array){
  let user = '';
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

  async truckSource() {
    const data = await getTrucks();
    let truckData = data.data.map((item) => ({
      id: item.TruckID,
      TruckInfo:item.TruckInfo,
      LicensePlate:item.LicensePlate,
      Available:item.Available,
      TruckNumber:item.TruckNumber,
      TruckType:item.TruckType
    }))
    return truckData;
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
        cellDuration={60}
        timeZone="America/Edmonton"
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
        appointmentComponent={FillTemplate}
        appointmentTooltipComponent={FillTooltip}
        onAppointmentDeleting={onAppointmentDeleting}
        onAppointmentFormOpening={this.onAppointmentForm}
        >
        <Resource
          dataSource={this.state.truckList}
          fieldExpr="TruckID"
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
      <Popup
      height='75%'
      title="Work Order Lookup"
      visible={this.state.showForm}
      onHiding={() => {this.setState({showForm:false})}}
      >
          <h2>Customer Active Quotes</h2>
          <List
          dataSource={this.state.custQuotes}
          itemRender={(data) => {
          return (
            <span>Quote Total: {data.total}  Date created: {format(new Date(data.creationDate),"MMMM do',' yyyy")} </span>
          )
          }}
          onItemClick={(data) => {
            return(
              <Popup
              visible={true}>

              </Popup>
            )
          }

          }>
          </List>
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
        <SelectBox
        onValueChanged={(data) => {
          this.setState({jobType:data.value});
        }}
        items={["fireproofing","removal","spray","loosefill"]}>
        </SelectBox>
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
              console.log(result);
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
         onClick={() => {this.setState({showForm:false})}}>
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

export default FillCalendar;