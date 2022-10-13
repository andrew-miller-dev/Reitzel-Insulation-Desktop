import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import qData from "./quoteData.js";
import Footerforquoto from "../footer";
import { message, Card, Row, Col } from "antd";
import {sendQuote, addNewQuote, addNewDetails, addNewProductLine} from '../../api/quotes';
import QuoteEmail from "../../Components/Email_Templates/quote_template";
import {renderEmail} from 'react-html-email';
import QuoteToWord from '../../Components/Word_Templates/quoteWord';
import  html2pdf  from "html2pdf.js";
import LogoHeader from "../../assets/header.js";


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
    
  } catch (error) {
    message.error("Something went wrong - please try again");
    console.log(error);
  }
  try {
    const pdf = document.getElementById("printContents");
    const opt = {
      filename: `${customer.first_name}_${customer.last_name}_Quote_${customer.quote_date}.pdf`
    };
    const worker = await html2pdf().set(opt).from(pdf).output("datauristring");
    if(customer.email !== 'undefined'){
      if(customer.billing_address === customer.site_address){
          sendQuote(customer.email, renderEmail(<QuoteEmail siteCard="none" info={customer}/>),worker)
      }
      
      else{
        sendQuote(customer.email, renderEmail(<QuoteEmail siteCard = "block" info={customer}/>),worker)
      }
    }
    message.success("Email sent");
  } catch (error) {
    console.log(error);
    message.error("Email failed to send");
  }
}

function downloadQuote(quote) {
  QuoteToWord(quote);
}

function getTotal(detail) {
  let total = 0.00;
        detail.details.forEach((item) => {
            total = total + parseFloat(item.total);
        });
        total = total.toFixed(2);
        return total;
}

function getTaxes(detail){
  let taxesTotal = 0.00;
  detail.details.map((item) => {
      item.productArr.map((item) => {
      taxesTotal = taxesTotal + parseFloat(item.tax);
  })
  })
  taxesTotal = taxesTotal.toFixed(2);
  return taxesTotal;
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
        style={{ width: "80%", margin: "auto"}}
      >
        {LogoHeader()}
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
            <div>
             <p>Quote Details</p>
              <table width="100%" border="1" cellPadding="10px">
              <tbody>
                {quoteFormData.details.map((item) => {

                    return (
                      <>
                      <tr>
                        <td colSpan="3" >
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
                      </>
                    );
                })}
                <tr>
                  <td>
                    Taxes: ${getTaxes(quoteFormData)}<br/>
                    Grand Total: ${Number(getTotal(quoteFormData)) + Number(getTaxes(quoteFormData))}
                  </td>
                </tr>
              </tbody>
            </table> 
            </div>
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
