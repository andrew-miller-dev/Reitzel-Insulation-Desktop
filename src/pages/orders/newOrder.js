import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import { Card, Checkbox, Row, Col, Form, DatePicker, Modal, Button, Select, message} from 'antd';
import { useRouteMatch } from "react-router-dom";
import { getDetailsID, getProductsID, getAvailableTrucks, addNewOrder, addNewOrderDetail, addNewOrderProduct, updateQuoteOnComplete } from '../../api/orders';
import { getAllInfoID } from '../../api/quoteEditAPI';
import Tabs from '../../Components/HomeTemplate/Tabs';
import FoamSnapshot from '../../Components/HomeTemplate/FoamCalendar/FoamSnapshot';
import FillSnapshot from '../../Components/HomeTemplate/FillCalendar/FillSnapshot';
import { disabledMinuteArr, disabledHourArr } from '../../util/storedArrays';

const { Item } = Form;
const {Option} = Select;
const { format } = require("date-fns-tz");

function NewOrder (props) {
    
    let quoteID = useRouteMatch('/orders/:oid/new').params.oid;
    const history = useHistory();
    const [quoteData, setQuoteData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [prodData, setProdData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quoteDetails, setQuoteDetails] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [form] = Form.useForm();
    const [trucks, setTrucks] = useState([]);

    useEffect(async() => {
      try {

        await getAllInfoID(quoteID).then((result) => {
          setQuoteData(result.data[0]);
        });
        let detailsInfo = await getDetailsID(quoteID);
          setDetailData(detailsInfo.data);
        let productInfo = await getProductsID(quoteID)
          setProdData(productInfo.data);
        createDetails(detailsInfo.data, productInfo.data);
        await getAvailableTrucks().then((result) => {
          setTrucks(result.data);
        })
      }
      
      catch(e) {
        console.log(e);
      }

      
      if(quoteData !== []){
        
        setLoaded(true);
      }
      
    }, [])

    const options = trucks.map((item) => (
      <Option key = {item.TruckID}>{item.TruckNumber + " " + item.TruckInfo} </Option> 
    ))
    
    const createOrder = async(values) => {
    const validResult = await form.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
      const endDate = new Date(values.selectedDate._d);
      const addedHours = endDate.setHours(endDate.getHours() + 3);
      const workOrderInfo = {
        allInfo:quoteData,
        selectedDetails:findSelectedDetails(),
        total:getSelectedTotal(findSelectedDetails()),
        startDate: format(
          values.selectedDate._d,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        endDate:format(
          addedHours,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        selectedTruck:values.selectedTruck,
      };
      let selectedTruckType = getTruckType(workOrderInfo.selectedTruck);
      let order = await addNewOrder(workOrderInfo, selectedTruckType, quoteID);
      try {
      let orderID = order.data.insertId;
      workOrderInfo.selectedDetails.forEach(async(item) => {
        let detail = await addNewOrderDetail(item, orderID);
        let detailID = detail.data.insertId;
        item.productArr.forEach(async(prod) => {
          await addNewOrderProduct(prod, orderID, detailID);
        });
      })
    }
    catch(e) {
      message.error("Something went wrong - please try again");
      console.log(e);
    }
    finally{
      if(order.status === 200){
        message.success("Order created");
      }
      props.updateOrder(workOrderInfo);
      updateAndCompleteQuote(workOrderInfo);
      history.push('/home');
    }
    }

    async function updateAndCompleteQuote(values) {
      let confirm = await updateQuoteOnComplete(values);
      return confirm;
    }

    function getTruckType(id) {
      let workType = "";
      trucks.forEach((truck) => {
        console.log(truck);
        if(truck.TruckID == id){
          workType = truck.TruckType;
        }         
      })
      return workType;
    }

    function getSelectedTotal() {
      let total = 0;
      quoteDetails.forEach((item) => {
        if(item.selected){
          total = total + item.total;
        }
      })
      return total;
    }

    function findSelectedDetails() {
      let selectItem = [];
      quoteDetails.forEach((item) => {
        if(item.selected){
          selectItem.push(item);
        }
      });
      return selectItem;
    }
    const createDetails = (detlist, prodlist) => {
      if(quoteDetails !== []){
      let temp = quoteDetails;
      detlist.map((detail) => {
         let detailObj = {
                  id: detail.SubtotalID,
                  details:detail.subtotalLines,
                  total:detail.subtotalAmount,
                  selected:false,
                  productArr:[]
              
          }
          prodlist.map((prod) => {
              if(prod.subtotalID === detail.SubtotalID){
                  let prodObj = {
                      id:prod.QuoteLineID,
                      product:prod.Product,
                      notes:prod.Notes,
                      price:prod.Subtotal
                  }
                  if(detailObj.productArr.length === 0){
                      detailObj.productArr[0] =prodObj;
                  }
                  else{
                      detailObj.productArr[detailObj.productArr.length] = prodObj;
                  }
                  
              }
          })
          if(temp.length === 0){
              temp[0] = detailObj;
          }
          else{
              temp[temp.length] = detailObj;
          }
          setQuoteDetails(temp);
      });        
    }
    else{
      console.log("already created details");
    }
  }

    const renderList = () => {
      let rows = [];
      if(quoteDetails.length > 0){
        quoteDetails.map((detail) => {
          rows.push(
            <div>
              <tr>
            <td>
              <Checkbox onChange={() => {detail.selected = !detail.selected;}}></Checkbox>
            </td>
            <td colSpan='2' style={{fontSize:"15px"}}>
              {detail.details}
            </td>
          </tr>
            {renderProducts(detail.productArr)}
            <tr>
              <td>

              </td>
              <td style={{fontSize:"15px"}}>
                <b>Total:</b>
              </td>
              <td>
                {detail.total}
              </td>
            </tr>
            </div>
          )
        })
      }
      return rows;
    }

    const renderProducts = (products) => {
      let rows = [];
      products.map((prod) => {
        rows.push(
          <tr>
            <td>
            </td>
            <td>
            </td>
            <td>
              {prod.product}
            </td>
            <td>
              {prod.notes}
            </td>
            <td>
              {prod.price}
            </td>
          </tr>
        )
      })

      return rows;
    }

    if(loaded === true){
     return (
        <div>
            <h2>New Order Creation</h2>
            

            
            <Card title="Customer and Address Information">
                <Row>
              <Col>
                <Card title="Customer" bordered={false} style={{ height:"250px"}}>
                    <p>{quoteData.CustFirstName} {quoteData.CustLastName}</p>
                    <p>{quoteData.Email}</p>
                    <p>{quoteData.Phone}</p>
                    <p>{quoteData.BillingAddress}</p>
                </Card>
              </Col>
              <Col>
              <Card title="Site Address" bordered={false} style={{ height:"250px"}}>
                  <p>{quoteData.Address}, {quoteData.City} {quoteData.Province}</p>
                  <p></p>
                  <p>{quoteData.PostalCode}</p>
                </Card>
              </Col>
            </Row>
            </Card>
            <Form form={form} onFinish={createOrder}>
            <Card title='Select the details'>
            <Item>
              <table>
                <tbody>
                  {renderList()}
                </tbody>
              </table>
            </Item>
              </Card>
              <Card title="Select the date">
                <Item
              name="selectedDate"
              rules={[
                {
                   required:true,
                   message:"Please select a date"
                }
              ]}
            >
              <DatePicker
                disabledTime={() => {
                  return {
                    disabledHours:() => disabledHourArr,
                    disabledMinutes: () => disabledMinuteArr
                  }
                }}
                showTime={{ 
                  hideDisabledOptions:true,
                  format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                className="datepicker"
              />
              
            </Item>
            <Item>
            <Button type="primary" onClick={() => {setShowCalendar(true)}}>Show Calendar</Button>
            </Item>
              </Card>
            
            
            <Card>
              <Item>
              <h1>Select truck</h1>
            </Item>
            <Item
            name="selectedTruck"
            rules={[
              {
                 required:true,
                 message:"Please select a truck"
              }
            ]}>
              <Select
              notFoundContent="No trucks available">
                {options}</Select>
            </Item>
            </Card>
            
            <Item>
              <Button size="large" type="primary" htmlType="submit">Create Work Order</Button>
            </Item>
            
            
                </Form>
            <Modal
            visible={showCalendar}
            onCancel={() => {setShowCalendar(false)}}
            width="90%"
            >
            <div>
              <Tabs>
                <div label="Foam">
                  <FoamSnapshot />
                </div>
                <div label ="Fill">
                <FillSnapshot />
                </div>
              </Tabs>
            </div>
            </Modal>
             
        </div>
    )   
    }
    else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}

export default NewOrder;