import React from 'react';
import Tabs from "../../Components/HomeTemplate/Tabs"; 
import SalesCalendar from '../../Components/HomeTemplate/SalesCalendar/SalesCalendar';
import FoamCalendar from '../../Components/HomeTemplate/FoamCalendar/FoamCalendar';
import FillCalendar from '../../Components/HomeTemplate/FillCalendar/FillCalendar';
import './Template.css';

class Template extends React.Component {
    constructor(props) {
        super(props);
      }
      
    render() {
        
        return(
      <div>
       <Tabs> 
         <div label="Sales"> 
           <SalesCalendar />
         </div> 
         <div label="Foam"> 
           <FoamCalendar />
         </div> 
         <div label="Fill"> 
         <FillCalendar />
         </div> 
       </Tabs> 
      </div>
    );
  }
}
  export default Template;