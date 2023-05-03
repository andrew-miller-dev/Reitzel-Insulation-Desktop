export default function Preview(props) {

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
          <br /> {quoteFormData.billing_address}, {quoteFormData.city}
          <br /> {quoteFormData.post_code}
          <br /> {quoteFormData.phone_number}
          <br /> {quoteFormData.email}
          <br />
        </Card>
        </Col>
        <Col>
        <Card>
          <strong>Jobsite Address</strong>
          <br />{quoteFormData.site_address}, {quoteFormData.site_city}
          <br />{quoteFormData.site_postal}
        </Card>
         </Col>
        </Row>
        <div style={{float:"right"}}>
          {quoteFormData.quoteDate}
        </div>
        <div>
          {quoteFormData.details.length > 0 && (
            <div>
              <table width="100%" border="0" cellPadding="10px">
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
                                  $ {prod.price}
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
                  <td colSpan={"3"} style={{textAlign:"right"}}>
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
