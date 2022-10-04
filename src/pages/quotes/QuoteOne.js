import React, {useState, useEffect} from "react";
import {useHistory } from "react-router-dom";
import Button from "../../component/quotes/Button";
import {useInput} from '../../hooks/input-hook';
import { useParams } from "react-router";
import qData from './quoteData.js';
import {getCustomerAddresses} from '../../api/customer';
import { getCustomers } from "../../api/calendar";
import {getUser} from '../../util/storage';
import { Card, Row, Col, Checkbox, Select, InputNumber, } from "antd";
const { Option } = Select;
const {format } = require('date-fns-tz');
let formatDate = format(new Date(),"MMMM do',' yyyy");

function QuoteOne(props) {
    const [isLoading, setLoading] = useState(true);

    let { qid } = useParams();
    let history = useHistory();

    
    let quotes = qData.quote_data;
    let selectedQuote  = (parseInt(qid)) ? quotes.find((d) => { return parseInt(d.id) === parseInt(qid) }): {};
    const quoteList = () => {
        return (
            quotes.map((item) => {
                return(
                <Option value={item.id}>{item.name}</Option>
           ) })
        )
    }
    
    if(Object.keys(selectedQuote).length === 0){
        history.push(`/quotes`);
    }
    const [user, setUser] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    
    useEffect(async () => {
        let result = await getCustomers();
            let cust = result.data.map((c) => (
                    {
                    value : c.CustFirstName + " " + c.CustLastName,
                    id : c.CustomerID,
                    name : c.CustFirstName + " " + c.CustLastName,
                    first_name : c.CustFirstName,
                    last_name : c.CustLastName,
                    phone : c.Phone,
                    email : c.Email,
                    address : c.BillingAddress,
                    city : c.CustCity,
                    postal_code : c.CustPostalCode,
                    region : c.CustRegion,
                }
            ));
            setCustomers(cust);
            setLoading(false);
            setUser(getUser());    
        },[selectedQuote]);

    const {value: custID, assignValue: assignCustID} = useInput();
    const {value: firstName, bind: bindFirstName, assignValue: assignFirstName} = useInput();
    const {value: lastName, bind: bindLastName, assignValue: assignLastName} = useInput();
    const {value: billingAddress, bind: bindBillingAddress, assignValue: assignBillingAddress} = useInput();
    const {value: city, bind: bindCity, assignValue: assignCity} = useInput();
    const {value: postCode, bind: bindPostCode, assignValue: assignPostCode} = useInput();
    const {value: phoneNumber, bind: bindPhoneNumber, assignValue: assignPhoneNumber} = useInput();
    const {value: email, bind: bindEmail, assignValue: assignEmail} = useInput();

    const {value: addressID, assignValue: assignAddressID} = useInput();
    const {value: siteAddress, bind: bindSiteAddress, assignValue: assignSiteAddress} = useInput();
    const {value: siteCity, bind: bindSiteCity, assignValue: assignSiteCity} = useInput();
    const {value: siteCode, bind: bindSiteCode, assignValue: assignSiteCode} = useInput();
    
    const {value: customerNotes, bind: bindCustomerNotes, assignValue: assignCustomerNotes} = useInput();
    const {value: installerNotes, bind: bindInstallerNotes, assignValue: assignInstallerNotes} = useInput();

    const [tax, setTax] = useState(true);
    const [taxRate, setTaxRate] = useState(13);
        const [counter, setcounter] = useState(1);
        const [detailKey, setDetailKey] = useState(1);
        const [prodKey, setProdKey] = useState(1);
        const [quotedetails, setquotedetails] = useState([{
                    key:0,
                    details:selectedQuote.details,
                    total:0.00,
                    productArr:[{
                        prodKey:0,
                        product:"",
                        price:0.00,
                        tax:0.00
                    }]
                }]);

    
    const options = customers.map((item) => (
        {
            label:`${item.first_name} ${item.last_name}`,
            value:`${item.id}`
        }
    ))
    async function onCustomerSelect(e, option) {
        if ((e === null || e === "" || e === undefined)) {
            
        } else {
            setAddresses([]);
            let customer = customers.find(element => element.id == option.value);
            assignCustID(option.value)
            assignFirstName(customer.first_name)
            assignLastName(customer.last_name)
            assignPhoneNumber(customer.phone)
            assignEmail(customer.email)
            assignBillingAddress(customer.address)
            assignCity(customer.city)
            assignPostCode(customer.postal_code)
            let result = await getCustomerAddresses(option.value);
            let addressList = result.data.map((item) => (
                {
                    value : item.Address,
                    id:item.AddressID,
                    address:item.Address,
                    postal:item.PostalCode,
                    city:item.City,
                    region:item.Region

                }
            ));
            setAddresses(addressList);
        }
    }

    async function onAddressSelect(e, option){
        if ((e === null || e === "" || e === undefined)) {
            
        } else {
            assignAddressID(option.id)
            assignSiteAddress(option.address)
            assignSiteCity(option.city)
            assignSiteCode(option.postal)
        }
    }
    
    const handleSubmit = (evt) => {

        var payload = 
        {
            quoteDate:formatDate,
            userInfo:user,
            id:custID,
            addressID: addressID,
            first_name: firstName,
            last_name: lastName,
            billing_address: billingAddress,
            city: city,
            post_code: postCode,
            phone_number: phoneNumber,
            email: email,
            site_address: siteAddress,
            site_city: siteCity,
            site_postal:siteCode,
            customer_notes: customerNotes,
            installer_notes: installerNotes,
            details: quotedetails,
            total: getQuoteTotal(quotedetails)
        }
        props.onSetQuoteFormDataChange(payload);
        evt.preventDefault();

    }

    const changeTax = () => {
        setTax(!tax);
        if(tax === true){

        quotedetails.map((item) => {
            item.productArr.map((item) => {
                item.tax = 0.00;
            })
        })
        
    }
        else {
            quotedetails.map((item) => {
                item.productArr.map((item) => {
                    let number = item.price;
                    number = number * (0 + '.' + taxRate.toString().padStart(2,0));
                    number = parseFloat(number); 
                    number = number.toFixed(2);
                    item.tax = number;
                })
            })
        }  
    setcounter(counter + 1);
    }        
    const addNewDetail = (id) => {
        let quote = {};
        quotes.forEach((item) => {
            if(item.id === id) {
                quote=item;
            }
        })
        setcounter(counter +1);
        var temp = quotedetails;
        if(temp[temp.length] === 0){
            temp[0] = {
                key:detailKey,
                details:quote.details,
                total:0.00,
                productArr:[]
            }
        }
        else{
            temp[temp.length] = {
                key:detailKey,
                details:quote.details,
                total:0.00,
                productArr:[]
            }
        }
        setDetailKey(detailKey + 1);
        setquotedetails(temp);
    }
    const handleAddProduct = (details,e) => {
        e.preventDefault();
        setcounter(counter + 1);
        var temp = quotedetails;
        var index = temp.indexOf(details);
        if(temp[index].productArr.length === 0){
            temp[index].productArr[0] = {
                prodKey:prodKey,
                product:"",
                price:0.00,
                tax:0.00
            }
        }
        else{
            temp[index].productArr[temp[index].productArr.length] = {
                prodKey:prodKey,
                product:"",
                price:0.00,
                tax:0.00
            }
        }
        setProdKey(prodKey + 1);
        setquotedetails(temp);
    }
    const handleRemoveRow = (details, prod ,e) => {
        e.preventDefault();
        setcounter(counter - 1);
        var temp = quotedetails;
        var index = temp.indexOf(details);
        var prodIndex = temp[index].productArr.indexOf(prod);
        temp[index].productArr.splice(prodIndex,1);
        setquotedetails(temp);
    }
    const handleRemoveDetail = (details,e) => {
        e.preventDefault();
        setcounter(counter -1);
        var temp = quotedetails;
        var index = temp.indexOf(details);
        temp.splice(index,1);
        setquotedetails(temp);
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
    const handleTax = (prod, e) => {
        if(e.target.value === ""){
            e.target.value = 0.00;
        }
        let number = parseFloat(e.target.value);
        if (tax == true){
            number = number * (0 + '.' + taxRate.toString().padStart(2,0));
            number = parseFloat(number); 
            number = number.toFixed(2);
            prod.tax = number;
        }
       else{
           prod.tax = 0.00;
       }
    }

    const renderProducts = (details) => {
        let rows = [];
            if(details.productArr.length !== 0){
                details.productArr.map((prod) => {

                    rows.push(
                         <tr>
                             <td>
                                 Product Details:
                                 <input type="text" size={50} key={prod.prodKey}  defaultValue={prod.product}
                                    onChange={(e) => {
                                        handleProductDetails(prod, e);
                                     }}
                                     className="ant-input"
                                     />
        
                             </td>
                            <td>
                                Price:
                                <input type="number" step=".01" key={prod.prodKey}
                                    onChange={(e) => {
                                        handleProductPrice(prod, e);
                                        handleTax(prod, e);
                                     }}
                                     className="ant-input"
                                     defaultValue='0.00'
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
        total = total.toFixed(2);
        details.total = total;
        return total;
    }
    const getQuoteTotal = (detail) => {
        let total = 0.00;
        detail.map((item) => {
            total = total + parseFloat(item.total) + parseFloat(getTaxes(quotedetails));
        });
        total = total.toFixed(2);
        return total;
    }

    const getTaxes = (details) => {
        let taxesTotal = 0.00;
        if(tax){
        details.forEach((item) => {
            item.productArr.map((item) => {
            taxesTotal = taxesTotal + parseFloat(item.tax);
        })
        })
    }
        taxesTotal = taxesTotal.toFixed(2);
        return taxesTotal;
    }
    const renderRows = () => {
        let rows = [];
        if(quotedetails !== []){
            
            quotedetails.map((detail) => {
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
                    <table>
                        <tr>
                            <td>
                                Select Customer:
                            </td>
                            <td>
                                <Select 
                                onSelect={(e, option) => {onCustomerSelect(e, option)}}
                                style={{ width: 200 }}
                                options={options}
                                placeholder="Enter a customer"
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }>    
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Select Site Address:
                            </td>
                            <td>
                                <Select
                                onSelect={(e, option) => {onAddressSelect(e, option)}}
                                style={{ width: 200 }}                
                                options={addresses}               
                                placeholder="Choose an address"                
                                filterOption={(inputValue, option) =>                
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1                
                                    }            
                                notFoundContent="Choose a customer first or no addresses found"                
                                ></Select>                                
                            </td>
                        </tr>
                    </table>
                    <br/>
                   
                   
                    <br/>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Card title="Customer and Billing" bordered={false}>
                            Customer:<br />
                    <input type="text" className="ant-input ant-col-8" name="first_name"
                            placeholder="First Name" {...bindFirstName} />
                    <input type="text" className="ant-input ant-col-8" name="last_name"
                            placeholder="Last Name" {...bindLastName} />
                    <br/>
                    Address:
                    <input type="text" className="ant-input" name="billing_address"
                            placeholder="Billing Address" {...bindBillingAddress} />
                    <br/>
                    City:
                    <input type="text" className="ant-input" name="city"
                            placeholder="contractor city" {...bindCity} />

                    <br/>
                    Postal Code:
                    <input type="text" className="ant-input" name="postal_code"
                            placeholder="contractor postal code" {...bindPostCode} />
                    <br/>
                    Phone:
                    <input type="text" className="ant-input" name="phone_number"
                            placeholder="contractor phone number" {...bindPhoneNumber} />

                    <br/>
                    Email:
                    <input type="text" className="ant-input" name="email"
                            placeholder="contractor email" {...bindEmail} />
                            </Card>
                        </Col>
                         <Col span={10}>
                            <Card title="Site Address" bordered={false}>
                    Address:
                    <input type="text" className="ant-input" name="site_address"
                            placeholder="Site Address" {...bindSiteAddress} />
                    <br/>
                    City:
                    <input type="text" className="ant-input" name="site_city"
                            placeholder="Site City" {...bindSiteCity} />
                    <br/>
                    Postal Code:
                    <input type="text" className="ant-input" name="site_code"
                            placeholder="Site Postal Code" {...bindSiteCode} />
                            </Card>
                        </Col>
                     </Row>
                    <br/>
                    <br/>
                    <table style={{width:"100%"}}>
                        <thead>
                        <tr>
                            <td>Quote Products:</td>
                            
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
                                    Apply tax 
                                </td>
                                <td>
                                    <Checkbox defaultChecked = {true} onChange={() => {changeTax()}}></Checkbox>
                                </td>
                                </tr>
                                <tr>
                                    <td style={{textAlign:"right"}} colSpan={2}>
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
                                        Taxes: 
                                    </td>
                                    <td>
                                        ${getTaxes(quotedetails)}
                                    </td>
                                </tr>
                                <tr>
                                <td style={{textAlign:"right"}}>
                                    Grand Total:
                                </td>
                                <td>
                                     ${getQuoteTotal(quotedetails)}
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
                    defaultValue={selectedQuote.customer_notes}
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
                    defaultValue={selectedQuote.installer_notes}
                    onChange={(e) => {
                        assignInstallerNotes(e.target.value);
                    }}
                    {...bindInstallerNotes}
                    >
                    </textarea>
                    <br/>
                    Estimator: {user.FirstName + " " + user.LastName} 

                    <br/>
                    <br/>
                    <br/>
                    <Button size="md" variant="primary" type="submit" className="ant-btn ant-btn-primary">Submit</Button>
                </div>
            </div>
        </form>
    );
}

export default QuoteOne;
