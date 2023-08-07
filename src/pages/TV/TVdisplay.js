import { Tabs, Card } from "antd";
import FillCalendar from "../../Components/HomeTemplate/FillCalendar/FillCalendar";
import FoamCalendar from "../../Components/HomeTemplate/FoamCalendar/FoamCalendar";
import SalesCalendar from "../../Components/HomeTemplate/SalesCalendar/SalesSnapshot";
import React, { useState, useEffect, useRef } from 'react';
import FoamSnapshot from "../../Components/HomeTemplate/FoamCalendar/FoamSnapshot";
import FillSnapshot from "../../Components/HomeTemplate/FillCalendar/FillSnapshot";
import Head from "../../component/head";
import HeadSmall from "../../component/head/headSmall";


export default function TVDisplay(props) {
const [activeTab, setActiveTab] = useState(1);

useInterval(() => {
  if(activeTab === 3) {
    setActiveTab(1);
  }
  else {
    setActiveTab(a => a + 1);
  }
}, 5000);


  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
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

    return (
      <>  
      <HeadSmall />
       <Card 
       tabList={items2}
       defaultActiveTabKey="1"
       activeTabKey={activeTab}
       >
      {contentList[activeTab]}
       </Card>
      </>
    )
}