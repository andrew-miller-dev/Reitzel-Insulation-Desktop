const header = "https://i.ibb.co/0snCVqq/header.png";
const {format } = require('date-fns-tz');


export default function OrderPreview(props) {

    const info = props.orderInfo;
    const date = new Date();
    const currentDate = date.getDay() + " " + date.getMonth() + " " + date.getFullYear();

    function renderRows() {
        let rows = [];
        info.selectedDetails.map((item) => {
            rows.push(
                <tr>
                    <td>
                        {info.allInfo.FirstName + " " + info.allInfo.LastName}
                    </td>
                    <td colSpan="2">
                        {item.details}
                    </td>
                </tr>
            )
        })
    return rows;
    }

    return (
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
                            <td style={{border:"1px solid grey", padding:"2px"}}>
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
                                {console.log(info)}
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
            <div>
                <table style={{border:"1px solid grey", width:"100%"}}>
                    <thead>
                        <tr style={{border:"1px solid grey", width:"100%"}}>
                            <td>
                                Item
                            </td>
                            <td>
                                Description
                            </td>
                            <td>
                                Ordered
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
            </div>
        </div>
    )
}