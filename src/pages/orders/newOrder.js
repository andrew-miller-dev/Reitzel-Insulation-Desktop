import React, {useState, useEffect} from 'react';
import {useInput} from '../../hooks/input-hook';
import { Card, Checkbox, Row, Col, Form, DatePicker, Modal, Button} from 'antd';
import { useRouteMatch } from "react-router-dom";
import { getAllInfoID, getDetailsID, getProductsID } from '../../api/orders';
import { ValueAxis } from 'devextreme-react/chart';

const { RangePicker } = DatePicker;
const { Item } = Form;


function NewOrder (props) {
    
    let quoteID = useRouteMatch('/orders/:oid/new').params.oid;

    const [quoteData, setQuoteData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [prodData, setProdData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quoteDetails, setQuoteDetails] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [form] = Form.useForm();

    useEffect(async() => {
      try {

        await getAllInfoID(quoteID).then((result) => {
          setQuoteData(result.data[0]);
          console.log(result.data[0]);
        });
        let detailsInfo = await getDetailsID(quoteID);
          setDetailData(detailsInfo.data);
        let productInfo = await getProductsID(quoteID)
          setProdData(productInfo.data);
        createDetails(detailsInfo.data, productInfo.data);
      
      }
      
      catch(e) {
        console.log(e);
      }

      
      if(quoteData !== []){
        
        setLoaded(true);
      }
      
    }, [])

    const createOrder = (values) => {
      const workOrderInfo = {
        allInfo:quoteData,
        selectedDetails:findSelectedDetails(),
        selectedDates:values.selectedDate,
        selectedTruck:null
      }
      props.updateOrder(workOrderInfo);
    }

    function findSelectedDetails() {
      let selectItem = [];
      quoteDetails.map((item) => {
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
            console.log(prod);
              if(prod.subtotalID === detail.SubtotalID){
                console.log("found match");
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
              <Checkbox onChange={() => {detail.selected = !detail.selected; console.log(detail)}}></Checkbox>
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
            >
              <RangePicker
                showTime={{ format: "HH:mm" }}
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