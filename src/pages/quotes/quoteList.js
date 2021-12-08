import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Input, Space, Popover} from "antd";
import { useHistory } from "react-router-dom";
import {getAllInfo, getDetails, getProducts, SearchAllInfo} from "../../api/quoteEditAPI";
import { getUser } from '../../util/storage';
import getWordDoc from './quoteToWordBypass';
const {Search} = Input;
const {format } = require('date-fns-tz')

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

      const getCompleted = (array) => {
        let newArr = [];
        array.forEach((item) => {
          if (item.completed) {
            newArr.push(item);
          }
        });
        if(newArr.length === 0) return null;
        else return newArr;
      }
      const getNotCompleted = (array) => {
        let newArr = [];
        array.forEach((item) => {
          if (!item.completed) {
            newArr.push(item);
          }
        });
        if(newArr === []) return null;
        else return newArr;
      }
      const getUserQuotes = (list) => {
        let newList = [];
        list.forEach((item) => {
          if(item.UserID === user.UserID){
            newList.push(item);
          }
        });
        return newList;
      }
    const getDetailsByID = (id) => {
        let array = [];
        detailData.forEach((item) => {
          if(item.quoteID === id){
            array.push({
              quoteID:item.quoteID,
              id:item.subtotalID,
              subtotalLines:item.subtotalLines,
              total:item.subtotalAmount,
              arr:getProductArr(item.SubtotalID)
            });
          }
        });
        return array;
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
    const getProductArr = (id) => {
      let array = [];
      prodData.forEach((item) => {
             if(item.subtotalID === id){
                  array.push({
                    prodID:item.QuoteLineID,
                    product:item.Product,
                    notes:item.Notes,
                    price:item.Subtotal
                  })
              }
          });
          return array;
    }
    const renderDetails = () => {
      let rows = [];
      formData.forEach((item) => {
        rows.push(<Card title="Details" bordered={true} type="inner">
          <p>{item.subtotalLines}</p>
          <strong>Products</strong>
          <table style={{width:'100%'}}>
            <tbody>
              {renderProducts(item.arr)}
            </tbody>
          </table>
          
          <p><strong>Total: </strong>{item.total}</p>
        </Card>)

      });
      return rows;
    }
    const renderProducts = (array) => {
      let rows = [];
      array.forEach((item) => {
        rows.push(
          <tr width="100px">
            <td>{item.product}</td>
            <td>{item.notes}</td>
            <td>{item.price}</td>
          </tr>
      )})
      return rows

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
              onClick={() => {
                history.push(`/orders/${data.QuoteID}/new`)
              }}>
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
                setFormData(getDetailsByID(data.QuoteID));
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

    const colComplete = [
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
        title:"Completed Date",
        key:"completeDate",
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
            onClick={() => {
              getWordDoc(data);
            }}>
              Download Quote
            </Button>
            <br />
            <br />
            <Button
            onClick={() => {
                
                setFormData(getDetailsByID(data.QuoteID));
                setShowForm(true);     
                            }}>
            View Quote</Button>
            </div>}
            trigger='clicked'>
            <Button>. . .</Button>
          </Popover>
          
        )
      }   
    ]
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
          

        <h2>Active Quotes</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={getNotCompleted(testData)}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
        <h2>Completed Quotes</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={getCompleted(testData)}
        columns={colComplete}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
        <Modal
        visible={showForm}
        title="View Quote"
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quotes/${formData[0].quoteID}/edit`)}}
        okText="Edit Quote"
        >
         <div>
           {renderDetails()}
         </div>
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
          

        <h2>Your Active Quotes</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={getUserQuotes(getNotCompleted(testData))}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
          <h2>Your Completed Quotes</h2>
          <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={getUserQuotes(getCompleted(testData))}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>
        <Modal
        visible={showForm}
        title="View Quote"
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quoteinfo/${formData[0].quoteID}`)}}
        okText="Edit Quote"
        >
         <div>
           {renderDetails()}
         </div>
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