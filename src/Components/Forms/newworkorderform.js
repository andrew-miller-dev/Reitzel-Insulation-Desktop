import FindCustomer from "../Form_Buttons/findCustomerButton";
import {Card, Row, Col, Select, Checkbox, Button, Form, message,} from 'antd';
import { getCustomerQuotes } from "../../api/calendar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuoteInfoCreate from "../QuoteInfoCreate";
import { getCustomerAddresses } from "../../api/customer";
import { getTrucks } from "../../api/trucks";
import DatePicker from "../DatePicker";
import { disabledMinuteArr, disabledHourArr } from '../../util/storedArrays';
import { addNewOrder, addNewOrderDetail, addNewOrderProduct, updateQuoteOnComplete } from '../../api/orders';

const {Item} = Form;
const { format } = require("date-fns-tz");

export default function NewWorkOrderForm(props) {
    const dispatch = useDispatch();
    const select = useSelector((state) => state);
    const [selectCustomer, setSelectCustomer] = useState([]);
    const [quoteList, setQuoteList] = useState([]);
    const [quoteDetails, setQuoteDetails] = useState({quote:null,detailArray:[]});
    const [address, setAddress] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [count, setCount] = useState(0);

    const [form] = Form.useForm();

    function getSelectedTotal() {
      let total = 0;
      quoteDetails.detailArray.forEach((item) => {
        if(item.selected){
          total = total + item.total;
        }
      })
      let taxTotal = getTaxesTotal(findSelectedDetails());
      total = total + parseFloat(taxTotal);
      return total;
    }

    function findSelectedDetails() {
      let selectItem = [];
      quoteDetails.detailArray.forEach((item) => {
        if(item.selected){
          selectItem.push(item);
        }
      });
      return selectItem;
    }

    function getTruckType(id) {
      let workType = "";
      trucks.forEach((truck) => {
        if(truck.TruckID == id){
          workType = truck.TruckType;
        }         
      })
      return workType;
    }

    async function updateAndCompleteQuote(values) {
      let confirm = await updateQuoteOnComplete(values);
      return confirm;
    }

    function getTaxes(detail){
      console.log(detail)
      let taxesTotal = 0.00;
          detail.arr.map((item) => {
          taxesTotal = taxesTotal + parseFloat(item.tax);
      })
      taxesTotal = taxesTotal.toFixed(2);
      return taxesTotal;
    }

    function getTaxesTotal(arr){
      let taxesTotal = 0.00;
      arr.map((item) => {
        item.arr.map((item2) => {
          taxesTotal = taxesTotal + parseFloat(item2.tax);
        })
      })
      taxesTotal = taxesTotal.toFixed(2);
      return taxesTotal;
    }

    const setDisplay = async(customer) => {
        setSelectCustomer(customer);
        setAddress([]);
        dispatch({type:"customerUpdate", payload:customer});
        const list = await getCustomerQuotes(customer.CustomerID);
        const addresses = await getCustomerAddresses(customer.CustomerID);
        setQuoteList(list.data);
        setAddress(addresses.data);
        document.getElementById("CustomerInfo").style.display = "block";
      }

    useEffect(()=> {
      let func = async() => {
        let truckList = await getTrucks();
        setTrucks(truckList.data);
      }
      func();
    },[])

    const getAddressName =(quote) => {
      const addressInfo = address.find(element => element.AddressID == quote.AddressID);
      if(address.length > 0){
      return addressInfo.Address;
      }
     else return [];
    }
    const optionsQuotes = quoteList.map((item) => (
        {
          label:`${getAddressName(item)}  ${item.QuoteTotal}`,
          value:item.QuoteID
        }
    ))

    const optionsTruck = trucks.map((item) =>(
      {
        label:`${item.TruckNumber} ${item.TruckInfo}   ${item.TruckType}`,
        value:item.TruckID
      }
    ))

      const renderList = (array) => {
        let rows = [];
        if(array.length > 0){
          array.forEach((detail) => {
            rows.push(
              <>
                <tr>
              <td width={'80px'} style={{margin:'auto'}}>
                <Checkbox onChange={() => {detail.selected = !detail.selected; setCount(count + 1)}}></Checkbox>
              </td>
              <td colSpan='2' >
                {detail.subtotalLines}
              </td>
            </tr>
              {renderProducts(detail.arr)}
              <tr>
                <td> 
                  Taxes: {getTaxes(detail)}
                </td>

              </tr>
              <tr>
                  
                <td>
                  Detail Total: 
                </td>
                <td>
                  <b>$ {detail.total}</b>
                </td>
              </tr>
              </>
            )
          })
        }
        return rows;
      }
  
      const renderProducts = (products) => {
        let rows = [];
        products.forEach((prod) => {
          rows.push(
            <tr>
              <td>
              </td>
              <td>
                {prod.product}
              </td>
              <td>
                {prod.price}
              </td>
            </tr>
          )
        })
  
        return rows;
      }

      const createOrder = async(values) => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
          const endDate = new Date(values.SelectedDate);
          const addedHours = endDate.setHours(endDate.getHours() + 3);
          const workOrderInfo = {
            allInfo:select.quoteReducer.quoteChosen.quote,
            selectedDetails:findSelectedDetails(),
            total:getSelectedTotal(),
            startDate: format(values.SelectedDate
              ,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            ),
            endDate:format(
              addedHours,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            ),
            selectedTruck:values.SelectedTruck,
          };
          let selectedTruckType = getTruckType(workOrderInfo.selectedTruck.value);
          let order = await addNewOrder(workOrderInfo, selectedTruckType, workOrderInfo.allInfo.QuoteID);
          try {
          let orderID = order.data.insertId;
          workOrderInfo.selectedDetails.forEach(async(item) => {
            let detail = await addNewOrderDetail(item, orderID);
            let detailID = detail.data.insertId;
            item.arr.forEach(async(prod) => {
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
          updateAndCompleteQuote(workOrderInfo);
          props.close();

        }
        }
    
    return (
        <div> 
          <Form form={form} onFinish={createOrder}
          initialValues={{
            ["SelectedTruck"]:{value:props.truck.id, label:props.truck.name},
            ["SelectedDate"]:new Date(props.start)
            }}>
          
            <Row wrap={false}>
                <Col flex={2}>
                <Card title="Customer">
                <FindCustomer setDisplay={setDisplay} />

                <div id="CustomerInfo" style={{display:"none"}}>
                    <Card title="Info">
                      {selectCustomer.CustFirstName}  {selectCustomer.CustLastName} <br />
                      {selectCustomer.BillingAddress} <br/>
                      {selectCustomer.CustCity} {selectCustomer.CustPostalCode}
                    </Card>
                    <Card title="Open Quotes">
                      <Select style={{width:'200px'}} 
                      options={optionsQuotes}
                      onSelect={async(value) => {
                        let data = await QuoteInfoCreate(value);
                        setQuoteDetails(data);
                        dispatch({type:"quoteUpdate",payload:data})
                      }}>
                      </Select>
                    </Card>
                </div>
                
            
          
            </Card>
                </Col>
               
                <Col flex={3}>
                <Card title="Select Details" >
                      {renderList(quoteDetails.detailArray)}
                      <br/>
                      Taxes for order: <span>$ {getTaxesTotal(findSelectedDetails())}</span><br/>
                      Total for order: <b>$ {getSelectedTotal()}</b>
                </Card>
                </Col>
            </Row>
            <Row>
              <Col flex={1}>
              </Col>
              <Col flex={1}>
              <Card title="Select Truck">
                <Item name="SelectedTruck"
                rules={[{required:true}]}> 
                  <Select style={{width:'200px'}} options={optionsTruck} labelInValue={true}>
                    </Select> 
                  </Item> 
                    
              </Card>
              <Button 
            type="primary"
            htmlType="submit"
            shape="round"
            size="large"
            block>Create Work Order</Button>
              </Col>
              <Col flex={1}>
               <Card title="Select Date">
                      <Item name="SelectedDate">
                        <DatePicker
                        //defaultValue={props.start}
                        className="datepicker"
                        disabledTime={() => {
                          return {
                            disabledHours:()=> disabledHourArr,
                            disabledMinutes:()=> disabledMinuteArr
                          }
                        }} 
                        showTime={{ hideDisabledOptions:true,
                                    format: 'HH:mm'}} />
                      </Item>
              </Card>
             
              </Col>
            </Row>

            
          </Form>
        </div>
    )
}