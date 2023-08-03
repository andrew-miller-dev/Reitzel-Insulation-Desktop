import { Tabs, Card } from "antd";
import FillCalendar from "../../Components/HomeTemplate/FillCalendar/FillCalendar";
import FoamCalendar from "../../Components/HomeTemplate/FoamCalendar/FoamCalendar";
import SalesCalendar from "../../Components/HomeTemplate/SalesCalendar/SalesSnapshot";
import Head from "../../component/head";
import { useEffect, useState } from "react";
import FoamSnapshot from "../../Components/HomeTemplate/FoamCalendar/FoamSnapshot";
import FillSnapshot from "../../Components/HomeTemplate/FillCalendar/FillSnapshot";


export default function TVDisplay(props) {
const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    setInterval(() => {
      timer();
    }, 5000);
  },[])

  
  const timer = () => {
    console.log("went off");
    console.log(activeTab)
    if(activeTab == 3) {
      setActiveTab(0);
    }
    else {
      setActiveTab(parseInt(activeTab + 1));
    }
  }

  const items2 = [
    {key:'1',
    tab:'Sales'},
    {key:'2',
    tab:'Foam'},
    {key:'3',
    tab:'Fill'},
  ];
  const contentList= {
    1: <SalesCalendar />,
    2: <FoamSnapshot />,
    3: <FillSnapshot />
  }

  const handleTabChange = key => {
    setActiveTab(key);
  };

    return (
      <>  
       <Card 
       tabList={items2}
       defaultActiveTabKey="1"
       activeTabKey={activeTab}
       onTabChange={key => {
        handleTabChange(key)
       }}>
      {contentList[activeTab]}
       </Card>
      </>
    )
}