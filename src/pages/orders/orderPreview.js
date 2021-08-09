import {Button, Space} from 'antd';


const header = "https://i.ibb.co/0snCVqq/header.png";
const {format } = require('date-fns-tz');


export default function OrderPreview(props) {

    const info = props.orderInfo;
    const date = new Date();
    const currentDate = date.getDay() + " " + date.getMonth() + " " + date.getFullYear();

    function printContent() {
        var content = document.getElementById("workForm");
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }
    function renderProducts(detail){
        console.log(detail);
        let prods=[];
        detail.productArr.map((item) => {
            prods.push(
                <div>
                    <p>{item.product} {item.notes}</p>
                    <p>{item.price}</p>
                </div>
                
            )
        });
        return prods;
    }

    function renderRows() {
        let rows = [];
        info.selectedDetails.map((item) => {
            rows.push(
                <tr>
                    <td style={{border:"1px solid grey", padding:"2px"}}>
                        {info.allInfo.FirstName + " " + info.allInfo.LastName}
                    </td>
                    <td colSpan="2"
                    style={{border:"1px solid grey", padding:"2px"}}>
                        {item.details}
                    </td>
                    <td style={{border:"1px solid grey", padding:"2px"}}>
                        {renderProducts(item)}
                    </td>
                </tr>
               
               
            )
        })
    return rows;
    }

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div id="workForm" style={{width:"80%", border:"1px solid grey"}}>
            <div className="head" style={{display:"flex",flexDirection:"row", margin:"auto", padding:"10px"}}>
                <div>
                <img src={header}></img>
                </div>
                <div>
                    <div style={{fontSize:"xx-large"}}>
                    Sales Order
                </div>
                <div>
                <table style={{border:"1px solid grey", margin:"1px", padding:"2px"}}>
                    <tbody>
                        <tr>
                            <td style={{border:"1px solid grey", padding:"2px", minWidth:"120px"}}>
                                Sales Date
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                Sales Order #
                            </td>
                        </tr>
                        <tr>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                {format(date,"MMMM do',' yyyy")}
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                            <input
                            size='5'></input>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
                </div>
                
            <div>
                <table style={{border:"1px solid grey"}}>
                    <thead >
                        <tr >
                            <td style={{border:"1px solid grey", padding:"3px"}}>
                                Customer Name and Address
                            </td>
                            <td style={{border:"1px solid grey", padding:"3px"}}>
                                Site Address
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{border:"1px solid grey", padding:"3px"}}>
                                {info.allInfo.CustFirstName + " " + info.allInfo.CustLastName}
                                <br/>
                                {info.allInfo.BillingAddress}
                                <br/>
                                {info.allInfo.CustCity}
                                <br/>
                                {info.allInfo.CustPostalCode}
                            </td>
                            <td style={{border:"1px solid grey", padding:"3px"}}>
                                {info.allInfo.Address}
                                <br/>
                                {info.allInfo.City + ", " + info.allInfo.Province}
                                <br/>
                                {info.allInfo.PostalCode}
                                <br/>
                                Customer Phone: {info.allInfo.Phone}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{float:'right', marginRight:'6%'}}>
            <table style={{border:"1px solid grey", margin:"1px", padding:"2px"}}>
                    <tbody>
                        <tr>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                P.O. #
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                Terms
                            </td>
                        </tr>
                        <tr>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                <input></input>
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                            <textarea>
                            </textarea>
                            <br />
                            Due on receipt
                            </td>
                        </tr>
                    </tbody>
                    </table>
            </div>
            <div>
                <table style={{border:"1px solid grey", width:"100%"}}>
                    <thead>
                        <tr style={{border:"1px solid grey", width:"100%"}}>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                Item
                            </td>
                            <td colSpan='2'
                            style={{border:"1px solid grey", padding:"2px"}}>
                                Description
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                Ordered
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='3'
                            style={{border:"1px solid grey", padding:"2px"}}>Additional Notes for Installers</td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>Total:</td>
                        </tr>
                        <tr>
                            <td colSpan='3'
                            style={{border:"1px solid grey", padding:"2px"}}>
                                {info.allInfo.notesInstallers}
                            </td>
                            <td style={{border:"1px solid grey", padding:"2px"}}>
                                $ <input
                                defaultValue={info.allInfo.QuoteTotal}>
                                </input>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <p>GST/HST No. 104459771</p>
            </div>
        </div>
        <footer>
            <br/>
            <Space>
                <Button
                onClick={() => {printContent()}}>
            Print
                </Button>
        <Button
        size='large'
        type="primary">
            Complete Work Order
        </Button>
        
            </Space>
             
        </footer>
        <iframe
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
       
    </div>
    )
}