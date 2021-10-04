import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import {getUsers,  getRegionAPI, getEstimateByIDToday, getEstimateByIDTomorrow} from '../../api/calendar';
import CustomStore from 'devextreme/data/custom_store';
import { getUser } from "../../util/storage";
import Legend from "../../Components/Legend";
import SalesToolSnap from "../../Components/HomeTemplate/SalesCalendar/salesToolSnap";

const { zonedTimeToUtc, format } = require('date-fns-tz');

const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
let hourCheck = currentDate.getHours();

const dataSource = new CustomStore({
  key: "EstimateID",
  load: async () => {
    let user = getUser();
    if(hourCheck < 18){
      console.log(hourCheck);
    const data = await getEstimateByIDToday(user.UserID);
    let formatData = data.data.map((item) => ({
      EstimateID : item.EstimateID,
      CustomerID : item.CustomerID,
      AddressID : item.AddressID,
      UserID : item.UserID,
      CreationDate : item.CreationDate,
      text : item.EstimateInfo,
      RegionID : item.RegionID,
      startDate : timeFormat(item.startDate),
      endDate : timeFormat(item.endDate)
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
      startDate : timeFormat(item.startDate),
      endDate : timeFormat(item.endDate)
    }));
    return formatData
    }
  }
});

const timeFormat = (date) => {
   let newdate = zonedTimeToUtc(new Date(date), 'America/Edmonton');
   var formatteddate = format(newdate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
   return formatteddate;
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
            <h1>Your work day</h1>
             <Scheduler
              timeZone="America/Edmonton"
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
        
     
    </div>
    );
  }
}
}

export default SalesmanTemplate;