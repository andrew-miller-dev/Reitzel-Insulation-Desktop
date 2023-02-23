import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import {getUsers,  getRegionAPI, getEstimateByIDToday, getEstimateByIDTomorrow, getEstimateTodayOnly} from '../../api/calendar';
import CustomStore from 'devextreme/data/custom_store';
import { getUser } from "../../util/storage";
import Legend from "../../Components/Legend";
import SalesToolSnap from "../../Components/HomeTemplate/SalesCalendar/salesToolSnap";
import { Button, Modal, Row, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ScheduleDLTemplate from "../../Components/Word_Templates/scheduleDL";

const {utcToZonedTime } = require('date-fns-tz');

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
let hourCheck = currentDate.getHours();

const dataSource = new CustomStore({
  key: "EstimateID",
  load: async () => {
    let user = getUser();
    if(hourCheck < 18){
    const data = await getEstimateByIDToday(user.UserID);
    let formatData = data.data.map((item) => ({
      EstimateID : item.EstimateID,
      CustomerID : item.CustomerID,
      AddressID : item.AddressID,
      UserID : item.UserID,
      CreationDate : item.CreationDate,
      text : item.EstimateInfo,
      RegionID : item.RegionID,
      startDate : utcToZonedTime(item.startDate),
      endDate : utcToZonedTime(item.endDate)
    }));
    return formatData
    }
    else {
      const data = await getEstimateByIDTomorrow(user.UserID);
    let formatData = data.data.map((item) => ({
      EstimateID : item.EstimateID,
      CustomerID : item.CustomerID,
      AddressID : item.AddressID,
      UserID : item.UserID,
      CreationDate : item.CreationDate,
      text : item.EstimateInfo,
      RegionID : item.RegionID,
      startDate : utcToZonedTime(item.startDate),
      endDate : utcToZonedTime(item.endDate)
    }));
    return formatData
    }
  }
});

const getApptList = async() => {
  let user = getUser();
  const data = await getEstimateTodayOnly(user.UserID);
    let formatData = data.data;
    const modal = Modal.info({
      okText:"Please wait",
      onOk:{},
      closable:false,
      title:'Download Schedule',
      content:<ScheduleDLTemplate list={formatData}/>
    });
    setTimeout(() => {
      modal.destroy()
    },2000)
}

const views = ['day'];

const renderResourceCell = (model) => {
  return (
      <b>{model.data.FirstName}</b>
  );
}

class SalesmanTemplate extends React.Component {
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
  }
  async InfoIsHere() {
  let regionData = await this.regionSource();
  let userData = await this.salesmanSource();
  this.setState({userList:userData});
  this.setState({regionList:regionData});
  this.setState({info:true});
} 
  
  onAppointmentForm(args) {
    args.cancel = true;
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
    const data = await getUsers();
    let salesData = data.data.map((item) => ({
      id: item.UserID,
      FirstName : item.FirstName,
      LastName: item.LastName
    }))
    return salesData;
  }
  componentDidMount(){
    this.InfoIsHere();
}

 
  render() {
    if (this.state.info == false){
        return (
          <p>Loading information...</p>
        )
      }
      else{

      
    return (
      
      <div style={{display:"flex",flexDirection:"row", margin:"auto"}}>
          <div style={{width:"30%"}}>
        <Legend />
        </div>
          <div style={{padding:"15px", width:"100%"}}>
           <Row><Space> <h1>Your work day</h1> <Button onClick={() => {getApptList()}} type="primary"shape="round" icon={<DownloadOutlined/>} >Download</Button></Space></Row>
             <Scheduler
              timeZone="America/Toronto"
              resourceCellRender={renderResourceCell}
              dataSource={dataSource}
              views={views}
              defaultCurrentView="day"
              defaultCurrentDate={date}
              width={'60%'}
              height={800}
              startDayHour={7}
              endDayHour={19}
              appointmentTooltipComponent={SalesToolSnap}
              onAppointmentAdding={(e) => {e.cancel = true}}
              onAppointmentDeleting={(e) => {e.cancel = true}}
              onAppointmentFormOpening={(e) => {e.cancel = true}}
              onAppointmentUpdating={(e) => {e.cancel = true}}
        >
        <Resource
          dataSource={this.state.regionList}
          fieldExpr="RegionID"
          useColorAsDefault={true}
        ></Resource>
        </Scheduler>
        </div>
        <div id="testPdf">
          <p>
            pdf tester
            </p>
        </div>
     
    </div>
    );
  }
}
}

export default SalesmanTemplate;