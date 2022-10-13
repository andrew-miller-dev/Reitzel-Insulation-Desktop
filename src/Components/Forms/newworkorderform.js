import FindCustomer from "../Form_Buttons/findCustomerButton";
import {Card, Row, Col, Select, Checkbox} from 'antd';
import { getCustomerQuotes } from "../../api/calendar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuoteInfoCreate from "../QuoteInfoCreate";
import { set } from "store";

export default function NewWorkOrderForm(props) {
    const dispatch = useDispatch();
    const select = useSelector((state) => state);
    const [selectCustomer, setSelectCustomer] = useState([]);
    const [quoteList, setQuoteList] = useState([]);
    const [quoteDetails, setQuoteDetails] = useState({quote:null,detailArray:[]});


    const setDisplay = async(customer) => {
        setSelectCustomer(customer);
        dispatch({type:"customerUpdate", payload:customer});
        const list = await getCustomerQuotes(customer.CustomerID);
        setQuoteList(list.data);
        document.getElementById("CustomerInfo").style.display = "block";
      }

      const optionsQuotes = quoteList.map((item) => (
        {
          label:`${item.Address}`,
          value:item.QuoteID
        }
      ))

      const renderList = (array) => {
        let rows = [];
        if(array.length > 0){
          array.forEach((detail) => {
            rows.push(
              <div>
                <tr>
              <td>
                <Checkbox onChange={() => {detail.selected = !detail.selected;}}></Checkbox>
              </td>
              <td colSpan='2' style={{fontSize:"15px"}}>
                {detail.subtotalLines}
              </td>
            </tr>
              {renderProducts(detail.arr)}
              <tr>
                <td>
  
                </td>
                <td style={{fontSize:"15px"}}>
                  <b>Total:</b>
                </td>
                <td>
                  $ {detail.total}
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
    return (
        <div>
            <Row>
                <Col>
                <Card title="Customer">
                <FindCustomer setDisplay={setDisplay} />

                <div id="CustomerInfo" style={{display:"none"}}>
                    <Card title="Info">
                      {selectCustomer.CustFirstName}  {selectCustomer.CustLastName} <br />
                      {selectCustomer.BillingAddress} <br/>
                      {selectCustomer.CustCity} {selectCustomer.CustPostalCode}
                    </Card>
                    <Card title="Open Quotes">
                      <Select style={{width:'150px'}} 
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
                <Col>
                <Card title="Select Details">
                      {renderList(quoteDetails.detailArray)}
                </Card>
                </Col>
            </Row>
            
        </div>
    )
}