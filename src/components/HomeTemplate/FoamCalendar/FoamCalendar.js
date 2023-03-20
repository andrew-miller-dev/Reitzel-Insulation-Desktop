import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import FillTemplate from '../FillCalendar/FillTemplate';
import FillTooltip from '../FillCalendar/FillTooltip';
import {getWorkOrderType,
  getRegionAPI, 
  sendEmail,
  getCustomers,
  updateWorkOrder,
  deleteWorkOrder,
  addNewOrder,
  markQuoteComplete} from '../../../api/calendar';
import { getCustomer } from "../../../api/customer.js";
import CustomStore from 'devextreme/data/custom_store';
import { message, Modal } from 'antd';
import {renderEmail} from 'react-html-email';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import ConfirmWorkOrder from "../../Email_Templates/confirm_work.js";
import UpdateWork from "../../Email_Templates/update_work.js";
import { getTrucksByType } from "../../../api/trucks.js";
import { addNewOrderDetail, addNewOrderProduct } from "../../../api/orders.js";
import NewWorkOrderForm from "../../Forms/newworkorderform";
const { confirm } = Modal;
const {format, utcToZonedTime, zonedTimeToUtc} = require("date-fns-tz");

const dataSource = new CustomStore({
  key: "WorkOrderID",
  load: async () => {
    const data = await getWorkOrderType("foam");
    let formatData = data.data.map((item) => ({
      WorkOrderID:item.WorkOrderID,
      CustomerID:item.CustomerID,
      AddressID:item.AddressID,
      TruckID:item.TruckID,
      UserID:item.UserID,
      RegionID:5,
      type:item.WorkType,
      total:item.TotalAmount,
      startDate:utcToZonedTime(item.startDate),
      endDate:utcToZonedTime(item.endDate),
     }));
    return formatData;
  },
  update: async (key, values) => {
    let formatData = {
      TruckID: values.TruckID,
      startDate : format(zonedTimeToUtc(values.startDate),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      endDate : format(zonedTimeToUtc(values.endDate),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  }
    const check = await updateWorkOrder(key, formatData);
    return check;
  },
  remove: async(key) => {
    const data = await deleteWorkOrder(key);
    return data
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

class FoamCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      groupByDate:true,
      regionList:"",
      truckList:"",
      info:false,
      showForm:false,
      mounted:false,
      formOption:{},
    };
    this.schedulerRef = React.createRef();
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.truckSource = this.truckSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.createTruckObj = this.createTruckObj.bind(this);
    this.closeForm = this.closeForm.bind(this);
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
  e.cancel = true;
  if(!e.appointmentData.total) {
   this.setState({formOption:<NewWorkOrderForm close={this.closeForm} truck={this.createTruckObj(e.appointmentData.TruckID)} start={new Date(e.appointmentData.startDate)}/>});
   this.setState({showForm:true});
  }
}

closeForm = () => {
  this.setState({showForm:false});
  this.schedulerRef.current.instance.getDataSource().reload();
}

createTruckObj = (id) => {
  let obj = {id:null,name:null}
  this.state.truckList.forEach(element => {
    if(element.id == id) {
      obj = {id:element.id,
            name:`${element.TruckNumber} ${element.TruckInfo} ${element.TruckType}`}
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

  async truckSource() {
    const data = await getTrucksByType("foam");
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
      ref={this.schedulerRef}
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
        startDayHour={8}
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
      <Modal
      width='75%'
      footer={false}
      destroyOnClose={true}
      visible={this.state.showForm}
      onCancel={() => {this.setState({showForm:false})}}
      >
          {this.state.formOption}
      </Modal>
    </div>
    );
  }
}
}

export default FoamCalendar;