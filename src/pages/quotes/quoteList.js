import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Input, Space, Popover, message} from "antd";
import { useHistory } from "react-router-dom";
import {getAllInfo, getDetails, getProducts, SearchAllInfo} from "../../api/quoteEditAPI";
import { getUser } from '../../util/storage';
import getWordDoc from './quoteToWordBypass';
import { GetOrderByQID } from '../../api/orders';
import ViewQuoteForm from '../../Components/Forms/viewquoteform';
const {Search} = Input;
const {format} = require('date-fns-tz')
var parseISO = require('date-fns/parseISO')

  function QuoteList() {
  let history = useHistory();
  let user = getUser();
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [prodData, setProdData] = useState([]);
  
    useEffect(() => {
          const func = async () => {
          await getAllInfo().then((result) => {
            setTestData(result.data);
          });
        
          await getDetails().then((item) => {
            setDetailData(item.data);
          });
          await getProducts().then((item) => {
            setProdData(item.data);
          })
        }
        func();
        
        if(testData !== []){
          setLoaded(true);
        }
        
      },[]);

      const getUserQuotes = (list) => {
        let newList = [];
        list.forEach((item) => {
          if(item.UserID === user.UserID){
            newList.push(item);
          }
        });
        return newList;
      }
    
    const checkDate = (date) => {
      let returnDate = "";
      if(date === "December 31st, 1969"){
      }
      else{
        returnDate = date;
    }
    return returnDate;
    }
    const findQuote = async (value) => {
      let result = await SearchAllInfo(value);
      setTestData(result.data)
    }
    const columns =[
      {
        title:"Customer Name",
        key:"customer",
        render:(data) => (
          <p>{data.CustFirstName + " " + data.CustLastName}</p>
        )
      },
      {
        title:"Address",
        key:"address",
        render:(data) => (
          <p>{data.Address  + ", " + data.City}</p>
        )
      },
      {},

      {
        title:"Salesman",
        key:"user",
        render: (data) =>(
          <div>
             <p>{data.FirstName + " " + data.LastName}</p>
          </div>
         
        )
      },
      {
        title:"Creation Date",
        key:"date",
        render: (data) => (
          <p>{format(new Date(data.creationDate),"MMMM do',' yyyy")}</p>
        ),
        sorter: (a,b) => new Date(a.creationDate) - new Date(b.creationDate)
      },
      {
        title:"Last Modified",
        key:"modDate",
        render: (data) => (
          <p>{checkDate(format(new Date(data.modifyDate), "MMMM do',' yyyy"))}</p>
        ),
        sorter: (a,b) => new Date(a.modifyDate) - new Date(b.modifyDate)
      },
      {
        title:"Options",
        key:"options",
        render: (data) => (
          <Popover content={
          <div>
            <Button
              onClick={async() => {
                if(data.completed !== null){
                const order = await GetOrderByQID(data.QuoteID);
                Modal.info({
                  title:"Appointment Information",
                  content:`Work order already created. Appointment time is ${format(parseISO(order.data[0].startDate),"MMMM do',' yyyy h':'mm aa")}`
                })
                
                }
                else{
                  history.push(`/orders/${data.QuoteID}/new`)
               }
                
              }
            }>
                Create Work Order
              </Button>
              <br />
              <br />
            <Button
            onClick={() => {
              getWordDoc(data);
            }}>
              Download Quote
            </Button>
            <br />
            <br />
            <Button
            onClick={() => { 
                setFormData(data.QuoteID);
                setShowForm(true);     
                            }}>
            View Quote</Button>
            </div>}
            trigger='clicked'>
            <Button>. . .</Button>
          </Popover>
        )
      }   
    ];

    if(loaded){

      if(user.SecurityLevel === 'admin'){
        return(
        <div>
          <div style={{marginLeft:"auto 0", marginRight:"auto 0"}}>
            <Search
                  style={{width:"40%"}}
                  className="searchbar"
                  size = "medium"
                  enterButton="Find Quote"
                  onChange={(e) => {findQuote(e.target.value)}} />
          </div>
          

        <h2>Quote List</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={testData}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
        <Modal
        visible={showForm}
        title="View Quote"
        destroyOnClose={true}
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quotes/${formData}/edit`)}}
        okText="Edit Quote"
        >
         <ViewQuoteForm id={formData}/>
        </Modal>
          </div>
      )
      }
      else if (user.SecurityLevel === 'salesman'){
        return (
          <div>
          <div style={{marginLeft:"auto 0", marginRight:"auto 0"}}>
            <Search
                  style={{width:"40%"}}
                  className="searchbar"
                  size = "medium"
                  enterButton="Find Quote"
                  onChange={(e) => {findQuote(e.target.value)}} />
          </div>
          

        <h2>Your Quotes</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={getUserQuotes(testData)}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
        <Modal
        visible={showForm}
        title="View Quote"
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quoteinfo/${formData}`)}}
        okText="Edit Quote"
        >
         <ViewQuoteForm id={formData}/>
        </Modal>
          </div>
        );
      }
      
    }

    else{
      return(
        <div>
          Loading...
        </div>
        
      );
      
    }
    }
export default QuoteList;