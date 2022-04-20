import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import FillTemplate from '../FillCalendar/FillTemplate';
import FillTooltip from '../FillCalendar/FillTooltip';
import {getWorkOrderType,
        getRegionAPI, 
        getCustomers,} from '../../../api/calendar';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import { getTrucksByType } from "../../../api/trucks.js";

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
      startDate:item.startDate,
      endDate:item.endDate,
     }));
    return formatData;
  }
});

const currentDate = new Date();
const date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','week', 'workWeek','month'];
const groups = ['TruckID'];

const renderResourceCell = (model) => {
  return (
      <b>Truck {model.data.TruckNumber} {model.data.TruckInfo}</b>
  );
}

class FoamSnapshot extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      groupByDate:false,
      regionList:"",
      truckList:"",
      info:false,
      mounted:false
    };
    
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
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
        onAppointmentAdding={(e) => {e.cancel = true}}
        onAppointmentDeleting={(e) => {e.cancel = true}}
        onAppointmentFormOpening={(e) => {e.cancel = true}}
        onAppointmentUpdating={(e) => {e.cancel = true}}
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
    </div>
    );
  }
}
}

export default FoamSnapshot;