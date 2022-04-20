import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import qData from "./quoteData.js";
import Headerforquoto from "../headforquote";
import Footerforquoto from "../footer";
import { message, Card, Row, Col } from "antd";
import {sendQuote, addNewQuote, addNewDetails, addNewProductLine} from '../../api/quotes';
import QuoteEmail from "../../Components/Email_Templates/quote_template";
import {renderEmail} from 'react-html-email';
import QuoteToWord from '../../Components/Word_Templates/quoteWord';


function printQuote() {
  var content = document.getElementById("printContents");
  var pri = document.getElementById("ifmcontentstoprint").contentWindow;
  pri.document.open();
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
}

async function emailQuote (customer){
  try {
    let quoteInfo = await addNewQuote(customer)
    let quoteID = quoteInfo.data.insertId;
    customer.details.map(async(details) => {
      let detailsConfirm = await addNewDetails(details, quoteID);
      let detailsID = detailsConfirm;
      details.productArr.map(async(item) => {
        await addNewProductLine(item, quoteID, detailsID.data.insertId);
        return item;
      })
      return details;
    })
    message.success("Email sent");
  } catch (error) {
    message.error("Something went wrong - please try again");
    console.log(error);
  }
  try {
    if(customer.email !== 'undefined'){
      sendQuote(customer.email, renderEmail(<QuoteEmail info={customer}/>))
    }
  } catch (error) {
    console.log(error);
    message.error("Email failed to send");
  }
}

function downloadQuote(quote) {
  QuoteToWord(quote);
}

function QuotePrint(props) {
  let { qid } = useParams();
  let history = useHistory();

  let quotes = qData.quote_data;
  let selectedQuote = parseInt(qid)
    ? quotes.find((d) => {
        return parseInt(d.id) === parseInt(qid);
      })
    : {};

  if (Object.keys(selectedQuote).length === 0) {
    history.push(`/quotes`);
  }

  const [quoteData, setQuoteData] = useState({});

  useEffect(() => {
    setQuoteData(selectedQuote);
  }, [selectedQuote]);

  const [quoteFormData] = useState(props.quoteFormData);

  return (
    <div>
      <div
        id="printContents"
        className="Quote print-page"
        style={{ width: "80%", margin: "auto" }}
      >
        <Headerforquoto />
        <Row>
        <Col> 
        <Card>
          <strong>Attention:</strong> {quoteFormData.first_name}{" "}
          {quoteFormData.last_name}
          <br /> Address: {quoteFormData.billing_address}
          <br /> City: {quoteFormData.city}
          <br /> Postal Code: {quoteFormData.post_code}
          <br /> Phone: {quoteFormData.phone_number}
          <br /> Email: {quoteFormData.email}
          <br />
        </Card>
        </Col>
        <Col>
        <Card>
          <strong>Site Address</strong>
          <br /> Site Address: {quoteFormData.site_address}
          <br /> Site City: {quoteFormData.site_city}
          <br /> Site Postal Code: {quoteFormData.site_postal}
        </Card>
         </Col>
        </Row>
        <div style={{float:"right"}}>
          {quoteFormData.quoteDate}
        </div>
        <div>
          {quoteFormData.details.length > 0 && (
            <table width="100%" border="1" cellPadding="10px">
              <thead>
                <tr>
                  <td colSpan="3">Quote Details</td>
                </tr>
              </thead>
              <tbody>
                {quoteFormData.details.map((item) => {

                    return (
                      <tr key={item.key} >
                      <tr >
                        <td colSpan="3" style={{width:'100%', minWidth:"875px"}}>
                          {item.details}
                        </td>
                        
                      </tr>
                      {item.productArr.map((prod) => {
                        return (
                            <tr key={prod.prodKey}>
                              <td width="80%">
                                {prod.product}
                              </td>
                                <td width="20%">
                                  {prod.price}
                                </td>
                              </tr>
                          );
                          })}
                      <tr>
                        <td colSpan="3" style={{textAlign:"right"}}>
                          Subtotal:${item.total}
                        </td>
                      </tr>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p>Notes to customer: {quoteFormData.customer_notes}</p>
        <p>Quote is valid for 30 days from the date on the quote</p>
        <p>Notes to installers: {quoteFormData.installer_notes}</p>
        <p>Estimator: {quoteFormData.userInfo.FirstName + " " + quoteFormData.userInfo.LastName}</p>
        
        <p>
        WSIB# Account #1941844 /  Firm # 245166V
        </p>
              <Footerforquoto />
      </div>
      <button onClick={printQuote}> Print this Quote</button>
      <button onClick={() => emailQuote(quoteFormData)}>Submit and send as Email</button>
      <button onClick={() => downloadQuote(quoteFormData)}> Download this Quote</button>
      <button onClick={() => {history.push("/quotes/change")}}>Edit this Quote</button>
      <iframe
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </div>
  );
}

export default QuotePrint;
