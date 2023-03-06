import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Legend from '../../Legend'
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import SalesTemplate from './SalesTemplate.js'
import SalesTooltip from './salesTooltip.js';
import {getUsersWithDisplay, 
        getRegionAPI, 
        getCustomers,} from '../../../api/calendar';
import { Modal, Space } from 'antd';
import 'devextreme-react/tag-box';
import 'devextreme-react/autocomplete';
import { Button } from "devextreme-react";
import NewEstimateForm from "../../Forms/newestimateform";
import {dataSource} from '../../../Components/SalesDatasource'
const { confirm } = Modal;
const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','week', 'workWeek','month'];
const groups = ['UserID'];

const renderResourceCell = (model) => {
  return (
      <b>{model.data.FirstName} {model.data.LastName[0]}</b>
  );
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
      showForm:false,
      formOption:{}
    };
    this.schedulerRef = React.createRef();
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.onAppointmentDeleting = this.onAppointmentDeleting.bind(this);
    this.salesmanSource = this.salesmanSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
    this.createUserObj = this.createUserObj.bind(this);
    this.closeForm = this.closeForm.bind(this);
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
  if(!e.appointmentData.CreationDate){
    this.setState({formOption:<NewEstimateForm close = {this.closeForm} start={e.appointmentData.startDate} end = {e.appointmentData.endDate} salesman = {this.createUserObj(e.appointmentData.UserID)} />});
    this.setState({showForm:true});
  }
}
onAppointmentDeleting = (e) => {
  var cancel = true;
  e.cancel = cancel;
  confirm({title:"Do you want to delete this appointment?", onOk(){dataSource.remove(e.appointmentData.EstimateID).then(()=>{this.schedulerRef.current.instance.getDataSource().reload();}) }, onCancel(){cancel = true}});
}

createUserObj = (id) => {
  let obj = {id:null,name:null}
  this.state.userList.forEach(element => {
    if(element.id == id) {
      console.log(element);
      obj = {id:element.id,
              name:element.FirstName,
              email:element.Email}
    }
  });
  return obj;
}

closeForm = () => {
  this.setState({showForm:false});
  this.schedulerRef.current.instance.getDataSource().reload();
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
      LastName: item.LastName,
      Email:item.Email
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
      ref={this.schedulerRef}
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
        onAppointmentDeleting={this.onAppointmentDeleting}
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