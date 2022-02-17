import React, {useState, useEffect} from 'react';
import Button from "../../component/quotes/Button";
import {useInput} from '../../hooks/input-hook';
import {Row, Col, Card, Checkbox, InputNumber, Select} from 'antd';
import qData from './quoteData.js';
const { Option } = Select;

function QuoteChange (props) {
    const [isLoading, setLoading] = useState(true);
    const [quoteData, setQuoteData] = useState(props.quoteFormData);
    const [detailKey, setDetailKey] = useState(props.quoteFormData.details.length);
    const [prodKey, setProdKey] = useState(0);
    const [taxRate, setTaxRate] = useState(13);
    let quotes = qData.quote_data;

    const quoteList = () => {
        return (
            quotes.map((item) => {
                return(
                <Option value={item.id}>{item.name}</Option>
           ) })
        )
    }

    useEffect( () => {
        let func = () => {
            setQuoteData(props.quoteFormData);
            setText(props.quoteFormData);
        }
        try {
            func();

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setcounter(counter + 1);
        },[]);
 
    const setText = (allInfo) => {
        assignFirstName(allInfo.first_name);
        assignLastName(allInfo.last_name);
        assignPhoneNumber(allInfo.phone_number);
        assignEmail(allInfo.email);
        assignBillingAddress(allInfo.billing_address);
        assignCity(allInfo.city);
        assignPostCode(allInfo.post_code);
        assignSiteAddress(allInfo.site_address);
        assignSiteCity(allInfo.site_city);
        assignSiteCode(allInfo.site_postal);
        assignCustomerNotes(allInfo.customer_notes);
        assignInstallerNotes(allInfo.installer_notes);
        assignUserFirstName(allInfo.userInfo.FirstName);
        assignUserLastName(allInfo.userInfo.LastName);

    setcounter(counter + 1);
    }

    const {value: firstName, assignValue: assignFirstName} = useInput();
    const {value: lastName, assignValue: assignLastName} = useInput();
    const {value: billingAddress,  assignValue: assignBillingAddress} = useInput();
    const {value: city,  assignValue: assignCity} = useInput();
    const {value: postCode, assignValue: assignPostCode} = useInput();
    const {value: phoneNumber,  assignValue: assignPhoneNumber} = useInput();
    const {value: email,  assignValue: assignEmail} = useInput();

    const {value: siteAddress,  assignValue: assignSiteAddress} = useInput();
    const {value: siteCity,  assignValue: assignSiteCity} = useInput();
    const {value: siteCode, assignValue: assignSiteCode} = useInput();
    
    const {value: customerNotes, bind: bindCustomerNotes, assignValue: assignCustomerNotes} = useInput();
    const {value: installerNotes, bind: bindInstallerNotes, assignValue: assignInstallerNotes} = useInput();

    const {value: userFirstName, assignValue: assignUserFirstName} = useInput();
    const {value: userLastName, assignValue: assignUserLastName} = useInput();

    const [tax, setTax] = useState(true);
    const [counter, setcounter] = useState(1);
    
    const handleSubmit = async (evt) => {
        quoteData.customer_notes = customerNotes;
        quoteData.installer_notes = installerNotes;
        evt.preventDefault();
        props.onSetQuoteFormDataChange(quoteData);
    }

    const changeTax = () => {
        if (tax === true){
            setTax(false);
        }
        else if (tax === false){
            setTax(true);
        }
    }        
    const addNewDetail = (id) => {
        let quote = {};
        quotes.forEach((item) => {
            if(item.id === id) {
                quote=item;
            }
        });
        var temp = quoteData;
        if(temp.details[temp.details.length] === 0){
            temp[0] = {
                key:detailKey,
                details:quote.details,
                total:0.00,
                productArr:[]
            }
        }
        else{
            temp.details[temp.details.length] = {
                key:detailKey,
                details:quote.details,
                total:0.00,
                productArr:[]
            }
        }
        setDetailKey(detailKey + 1);
        setQuoteData(temp);
        setcounter(counter +1);
    }
    const handleAddProduct = (details) => {
        setcounter(counter + 1);
        var temp = quoteData;
        var index = temp.details.indexOf(details);
        if(temp.details[index].productArr.length === 0){
            temp.details[index].productArr[0] = {
                id:null,
                prodKey:prodKey,
                product:"",
                price:0.00
            }
        }
        else{
            temp.details[index].productArr[temp.details[index].productArr.length] = {
                id:null,
                prodKey:prodKey,
                product:"",
                price:0.00
            }
        }
        setProdKey(prodKey + 1);
        setQuoteData(temp);
    }
    const handleRemoveRow = (details, prod ,e) => {
        e.preventDefault();
        setcounter(counter - 1);
        var temp = quoteData;
        var index = temp.details.indexOf(details);
        var prodIndex = temp.details[index].productArr.indexOf(prod);
        temp.details[index].productArr.splice(prodIndex,1);
        setQuoteData(temp);
    }
    const handleRemoveDetail = (details,e) => {
        e.preventDefault();
        setcounter(counter -1);
        var temp = quoteData;
        var index = temp.details.indexOf(details);
        temp.splice(index,1);
        setQuoteData(temp);
    }
    const handleDetailChange = (details, e) => {
        details.details = e.target.value
        details.details.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }
    const handleProductDetails = (prod, e) => {
        prod.product = e.target.value;
    }
    const handleProductPrice = (prod, e) => {
        if(e.target.value === ""){
            e.target.value = 0.00;
        }
        let newPrice = parseFloat(e.target.value);
        let rounded = newPrice.toFixed(2);
        prod.price = rounded;
        setcounter(counter + 1);
    }
    const renderProducts = (details) => {
        let rows = [];
            if(details.productArr.length !== 0){
                details.productArr.forEach((prod) => {

                    rows.push(
                         <tr>
                             <td>
                                 Details:
                                 <input type="text" key={prod.prodKey} size={50}  defaultValue={prod.product}
                                    onChange={(e) => {
                                        handleProductDetails(prod, e);
                                     }}
                                     className="ant-input"
                                     />
        
                             </td>
                            <td>
                                Price:
                                <input type="number" step=".01" key={prod.prodKey} defaultValue={prod.price}
                                    onChange={(e) => {
                                        handleProductPrice(prod, e);
                                     }}
                                     className="ant-input"
                                     />
                            </td>
                             <td style={{textAlign:"right"}}>
                             <Button size="sm" variant="danger"  onClick={(e) => { handleRemoveRow(details, prod, e)}} >x</Button>
                             </td>
                         </tr>);
                });
            }
            return rows;
    }
    const getTotal = (details) => {
        let total = 0.00;
        details.productArr.map((item) => {
            total = total + parseFloat(item.price);
        });
        if (tax == true){
            total = total * (1 + '.' + taxRate.toString().padStart(2,0));
            total = parseFloat(total);
        }
        total = total.toFixed(2);
        details.total = total;
        return total;
    }
    const getQuoteTotal = (detail) => {
        let total = 0.00;
        detail.forEach((item) => {
            total = total + parseFloat(item.total);
        });
        total = total.toFixed(2);
        return total;
    }
    const renderRows = () => {
        let rows = [];
        if(quoteData.details.length > 0){
            
            quoteData.details.forEach((detail) => {
            rows.push(
            <tr>
            <tr>
            <tr>
            <td colSpan="2">
                    <textarea 
                    key={detail.key}
                    cols="150" 
                    rows="6" 
                    className="ant-input"
                    defaultValue={detail.details}
                    onChange={(e) => {
                            handleDetailChange(detail, e)
                        }}
                    >
                    </textarea>
                </td>
                <td></td>
                <td style={{textAlign:"right"}}>
                    <Button size="sm" variant="danger"  onClick={(e) => { handleRemoveDetail(detail,e)}} >Delete</Button>
                </td>
            </tr>
            Products:
            </tr>
                <tr>
                    {renderProducts(detail)}
                </tr>
        <tr>
            <td>
                <Button size="sm" variant="primary" onClick={(e) => {handleAddProduct(detail,e)}}>Add Detail</Button>
            </td>
              
        </tr>
              
            <tr>
            <td style={{textAlign:"right"}}>
                        Subtotal: {getTotal(detail)}
                        </td>
            </tr>
            </tr>
            );
            
        });
        }
        return rows;
    }
    

    
    if (isLoading) {
        return <div className="App">Loading...</div>;
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="Quote" style={{width:"80%"}}>
                <div>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Card title="Customer and Billing" bordered={false}>
                           <p><b>Customer: </b> {firstName} {lastName}</p>
                    Address:
                    <p>{billingAddress}</p>
                    City:
                    <p>{city}</p>
                    Postal Code:
                    <p>{postCode}</p>
                    Phone:
                    <p>{phoneNumber}</p>
                    Email:
                    <p>{email}</p>
                            </Card>
                        </Col>
                         <Col span={10}>
                            <Card title="Site Address" bordered={false}>
                    Address:
                    <p>{siteAddress}</p>
                    City:
                    <p>{siteCity}</p>
                    Postal Code:
                    <p>{siteCode}</p>
                            </Card>
                        </Col>
                     </Row>
                    <br/>
                    <br/>
                    <table style={{width:"100%"}}>
                        <thead>
                        <tr>
                            <td>Quote Details and Products:</td>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {renderRows()}
                        <tr>
                            <td>
                               Add New Product:<Select
                               style={{width:200}}
                               size="small"
                               defaultValue="Select a template"
                               onSelect={addNewDetail}>
                                   {quoteList()}
                               </Select>
                            </td>
                        </tr>
                        
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{textAlign:"right"}}>
                                    Apply tax <Checkbox defaultChecked = {true} onChange={() => {changeTax()}}></Checkbox>
                                </td>
                                </tr>
                                <tr>
                                    <td style={{textAlign:"right"}}>
                                    Tax rate: <InputNumber
                                    style={{width:"55px"}}
                                    size="small"
                                    min={1}
                                    max={99}
                                    defaultValue={13}
                                    step={1}
                                    parser={value => Math.floor(value)}
                                    onChange={value => {setTaxRate(value)}}
                                    ></InputNumber> %
                                    </td>
                                </tr>
                                <tr>
                                <td style={{textAlign:"right"}}>
                                    Quote Total: ${getQuoteTotal(quoteData.details)}
                                </td>
                            </tr>
                        </tfoot>
                </table>

                    Notes to customer:
                    <textarea 
                    cols="150" 
                    rows="3" 
                    className="ant-input"
                    name="customer_notes"
                    defaultValue={customerNotes}
                    onChange={(e) => {
                        assignCustomerNotes(e.target.value);
                    }  }
                    {...bindCustomerNotes}
                    >
                    </textarea>

                    <br/>

                    Notes to installers:
                    <textarea 
                    cols="150" 
                    rows="3" 
                    className="ant-input"
                    name="installer_notes"
                    defaultValue={installerNotes}
                    onChange={(e) => {
                        assignInstallerNotes(e.target.value);
                    }}
                    {...bindInstallerNotes}
                    >
                    </textarea>
                    <br/>
                    <p>Estimator: {userFirstName + " " + userLastName}</p>< br/>
                    <br/>
                    <br/>
                    <br/>
                    
                    <Button size="md" variant="primary" type="submit" className="ant-btn ant-btn-primary">Finish Quote</Button>
                </div>
            </div>
        </form>
    );
}

export default QuoteChange;