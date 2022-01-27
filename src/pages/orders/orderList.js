import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Input, Popover} from "antd";
import { useHistory } from "react-router-dom";
import { SearchAllInfo} from "../../api/quoteEditAPI";
import { getAllInfoWO, getDetailsWO, getProductsWO } from '../../api/orders';
import { getUser } from '../../util/storage';
import WorkToPDFConvert from './workToPDFconvert';
const {Search} = Input;
const {format, zonedTimeToUtc } = require('date-fns-tz')

  function OrderList() {
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
          await getAllInfoWO().then((result) => {
            setTestData(result.data);
          });
        
          await getDetailsWO().then((item) => {
            setDetailData(item.data);
          });
          await getProductsWO().then((item) => {
            setProdData(item.data);
          })
        }
        func();
        
        if(testData !== []){
          setLoaded(true);
        }
        
      }, []);

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
          if(item.OrderID === id){
            array.push({
              WorkOrderID:item.OrderID,
              id:item.WODetailID,
              details:item.Details,
              total:item.DetailTotal,
              arr:getProductArr(item.WODetailID)
            });
          }
        });
        return array;
    }
    const getProductArr = (id) => {
      console.log(prodData);
      let array = [];
      prodData.forEach((item) => {
             if(item.WODetailID === id){
                  array.push({
                    prodID:item.WOProdID,
                    product:item.Product,
                    price:item.Price
                  })
              }
          });
          return array;
    }
    const renderDetails = () => {
      console.log(formData);
      let rows = [];
      formData.forEach((item) => {
        rows.push(
        <Card title="Details" bordered={true} type="inner">
          <p>{item.details}</p>
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
          <p>{data.Address  + "," + " " + data.City}</p>
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
        title:"Date Completed",
        key:"completed",
        render: (data) =>{
            if(data.completeDate !== null) {
              return <p>{format(zonedTimeToUtc(data.completeDate,"America/Toronto"),"MMMM do',' yyyy")}</p>
            }
            else return <p> </p>
        },
        sorter: (a,b) => new Date(a.completeDate) - new Date(b.completeDate)
      },
      {
        title:"Options",
        key:"options",
        render: (data) => (
          <Popover content={
            <div>
             <Button
            onClick={() => {
              WorkToPDFConvert(data);
            }}>
              Download Work Order
            </Button>
            <br />
            <br/>
            <Button
            onClick={() => { 
              setFormData(getDetailsByID(data.WorkOrderID));
              setShowForm(true);     
                          }}>
              View Work Order
            </Button>
          </div>
          }
          trigger="clicked">
          <Button>. . . </Button>
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
                  enterButton="Find Order"
                  onChange={(e) => {findQuote(e.target.value)}} />
          </div>

        <h2>Active Work Orders</h2>
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
        title="View Work Order"
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quoteinfo/${formData[0].quoteID}`)}}
        okText="Edit Work Order"
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
          

        <h2>Your Active Work Orders</h2>
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
        title="View Work Order"
        onCancel={() => {setShowForm(false)}}
        onOk={() => {history.push(`/quoteinfo/${formData[0].quoteID}`)}}
        okText="Edit Work Order"
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
export default OrderList;