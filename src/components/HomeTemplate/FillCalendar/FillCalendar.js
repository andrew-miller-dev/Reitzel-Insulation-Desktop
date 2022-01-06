import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import FillTemplate from './FillTemplate.js';
import FillTooltip from './FillTooltip';
import {getWorkOrderType,
        getRegionAPI, 
        sendEmail,
        getCustomers,
        updateWorkOrder,
        getCustomerQuotes,
        getQuoteDetails,
        getQuoteProducts,
        deleteWorkOrder,
        addNewOrder,
        markQuoteComplete} from '../../../api/calendar';
import { getCustomer } from "../../../api/customer.js";
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal, Space } from 'antd';
import {renderEmail} from 'react-html-email';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import ConfirmWorkOrder from "../../Email_Templates/confirm_work.js";
import UpdateWork from "../../Email_Templates/update_work.js";
import { Form, Popup, Button, List } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { getTrucksByType } from "../../../api/trucks.js";
import { createDetails, getSelectedDetails, getSelectedTotal, getTruckType, renderList } from "./FillFunctions.js";
import { addNewOrderDetail, addNewOrderProduct } from "../../../api/orders.js";
const { confirm } = Modal;
const { format } = require("date-fns-tz");

const dataSource = new CustomStore({
  key: "WorkOrderID",
  load: async () => {
    const data = await getWorkOrderType("loosefill");
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
    const data = await deleteWorkOrder(key);
    return data;
    
  },
  insert: async (values) => {
    try{
      const result = await addNewOrder(values);
      let workID = result.data.insertId;
      values.details.forEach(async detail => {
        const detailResult = await addNewOrderDetail(detail, workID);
        let detailID = detailResult.data.insertId;
        detail.productArr.forEach(async prod => {
           await addNewOrderProduct(prod, workID, detailID);
        });
      });
      let complete = await markQuoteComplete(values);
      if(complete.status === 200){
        message.success("Work order added");
      }
    }
    catch(e) {
      message.error("Something went wrong");
      console.log(e);
    }
    const custEmail = findCustomerEmail(values.CustomerID);
    sendEmail(custEmail.Email, renderEmail(<ConfirmWorkOrder info = {values} />,"Job Confirmation - Reitzel Insulation"));
  },
  onUpdating: (key, values) => {
    
    confirm({title:"Send email update to customer?", onOk() {sendEmailUpdate(values)}, cancelText:"No"})
  }
});
const sendEmailUpdate = async (values) => {
  let customerEmail = findCustomerEmail(values.CustomerID);
  sendEmail(customerEmail.Email, renderEmail(<UpdateWork info = {values}/>),"Job Update - Reitzel Insulation");
}

const findCustomerEmail = async(id) => {
  const email = await getCustomer(id);
  const customerEmail = email.data[0];
  return customerEmail;
}

const currentDate = new Date();
const date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
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
  confirm({title:"Do you want to delete this work order?", onOk(){dataSource.remove(e.appointmentData.WorkOrderID) }, onCancel(){cancel = true}});
}

class FillCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      groupByDate:false,
      regionList:"",
      truckList:"",
      info:false,
      findCustomerList:[],
      showForm:false,
      showQuote:false,
      clickedTruck:"",
      dates:{
        start:"",
        end:""
      },
      custInfo:[],
      custQuotes:[],
      selectQuote:[],
      selectQuoteDetails:[],
      mounted:false,
    };
    
    this.createOrder = this.createOrder.bind(this);
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.truckSource = this.truckSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
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

createOrder () {
    let values = {
        startDate:this.state.dates.start,
        endDate:this.state.dates.end,
        TruckID:this.state.clickedTruck,
        CustomerID:this.state.custInfo.CustomerID,
        AddressID:this.state.selectQuote.AddressID,
        UserID:this.state.selectQuote.UserID,
        QuoteID:this.state.selectQuote.id,
        WorkType:getTruckType(this.state.clickedTruck, this.state.truckList),
        total:getSelectedTotal(this.state.selectQuoteDetails),
        details:getSelectedDetails(this.state.selectQuoteDetails),
    }
    dataSource.insert(values);
    this.setState({showQuote:false}); 
    this.setState({selectQuote:[]});
    this.setState({showForm:false});

}

async onAppointmentForm (e) {
  if(e.appointmentData.WorkOrderID) {
    e.cancel = true;
  }
  
  else{
  let form = e.form;
  this.setState({clickedTruck:e.appointmentData.TruckID});
  var dates = {...this.state.dates};
          dates.start = format(e.appointmentData.startDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          dates.end = format(e.appointmentData.endDate,"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          this.setState({dates});
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
            e.popup.hide();
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
                
            }));

            this.setState({custQuotes:quoteList});
            this.setState({showForm:true});
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
    const data = await getTrucksByType("loosefill");
    let truckData = data.data.map((item) => ({
      id:item.TruckID,
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
      title="Quote Lookup"
      visible={this.state.showForm}
      onHiding={() => {this.setState({showForm:false})}}
      >
          <h2>Customer Active Quotes</h2>
          <List
          noDataText="Customer has no active quotes"
          dataSource={this.state.custQuotes}
          itemRender={(data) => {
          return (
            <span>Quote Total: {data.total}  Date created: {format(new Date(data.creationDate),"MMMM do',' yyyy")} </span>
          )
          }}
          onItemClick={async(data) => {
            let detailList = await getQuoteDetails(data.itemData.id);
            let prodList = await getQuoteProducts(data.itemData.id);
            let quoteDetails = createDetails(detailList.data, prodList.data);
            this.setState({selectQuoteDetails:quoteDetails});
            this.setState({selectQuote:data.itemData});
            this.setState({showQuote:true});
          }

          }>
          </List>
        <br/>
        
        <div style={{float:"right"}}>

        <Space>
        <Button
         style={{fontSize:"14px",padding:"7px 15px 7px 15px"}}
         onClick={() => {this.setState({showForm:false}); this.setState({selectQuote:[]}); this.setState({selectQuoteDetails:[]})}}>
          Cancel
        </Button>
        </Space>
        </div>
      </Popup>
      <Popup
      visible={this.state.showQuote}
      onHiding={()=>{this.setState({showQuote:false}); this.setState({selectQuote:[]})}}>
        <Form
        title="Work Order Creation">
          <Item>
           <h2> Select details</h2> 
            </Item>        
            <Item>
              <table>
                <tbody>
                    {renderList(this.state.selectQuoteDetails)}
                </tbody>
              </table>
            </Item>
            <Item>
              <Button onClick={() => {this.createOrder()}} text="Create Work Order"/>
            </Item>      
        </Form>
      </Popup>
    </div>
    );
  }
}
}

export default FillCalendar;