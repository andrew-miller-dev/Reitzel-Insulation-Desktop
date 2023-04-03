import {getQuoteDetails, getProductList, updateQuote, updateDetail, updateProduct, deleteProduct, deleteDetail, getAllInfoID } from "../../api/quoteEditAPI";
import {addNewDetails, addNewProductLine} from '../../api/quotes';
import React, {useState, useEffect} from 'react';
import Button from "../../component/quotes/Button";
import {useInput} from '../../hooks/input-hook';
import {Row, Col, Card, Checkbox, message, InputNumber} from 'antd';
import { useHistory, useRouteMatch } from "react-router-dom";

function QuoteEdit (props) {
    let quoteID = useRouteMatch('/quotes/:qid/edit').params.qid;
    let history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [quoteData, setQuoteData] = useState([]);
    const [quoteDetail, setQuoteDetail] = useState([]);
    const [productList, setProductList] = useState([]);
    const [detailKey, setDetailKey] = useState(0);
    const [prodKey, setProdKey] = useState(0);
    const [taxRate, setTaxRate] = useState(13);

    useEffect( () => {
        let func = async() => {
            let allInfo = await getAllInfoID(quoteID);
            let detailList = await getQuoteDetails(quoteID);
            setQuoteDetail(detailList.data);
            let products = await getProductList(quoteID);
            setProductList(products.data);
            createDetails(detailList.data, products.data);
            setText(allInfo.data[0]);
        }
        try {
            func();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setcounter(counter + 1);
        },[]);
 

    const createDetails = (detlist, prodlist) => {
        let temp = quotedetails;
        detlist.forEach((detail) => {
           let detailObj = {
                    id: detail.SubtotalID,
                    key:detailKey,
                    details:detail.subtotalLines,
                    total:detail.subtotalAmount,
                    productArr:[]
                
            }
            setDetailKey(detailKey + 1);
            prodlist.forEach((prod) => {
                if(prod.subtotalID === detail.SubtotalID){
                    let prodObj = {
                        id:prod.QuoteLineID,
                        key:prodKey,
                        product:prod.Product,
                        price:prod.Subtotal,
                        tax:prod.Tax
                    }
                    if(detailObj.productArr.length === 0){
                        detailObj.productArr[0] =prodObj;
                    }
                    else{
                        detailObj.productArr[detailObj.productArr.length] = prodObj;
                    }
                    setProdKey(prodKey + 1);
                }
            })
            if(temp.length === 0){
                temp[0] = detailObj;
            }
            else{
                temp[temp.length] = detailObj;
            }
            setquotedetails(temp);
        });        
    }
    const setText = (allInfo) => {
        assignFirstName(allInfo.CustFirstName);
        assignLastName(allInfo.CustLastName);
        assignPhoneNumber(allInfo.Phone);
        assignEmail(allInfo.Email);
        assignBillingAddress(allInfo.BillingAddress);
        assignCity(allInfo.CustCity);
        assignPostCode(allInfo.CustPostalCode);
        assignSiteAddress(allInfo.Address);
        assignSiteCity(allInfo.City);
        assignSiteCode(allInfo.PostalCode);
        assignCustomerNotes(allInfo.notesCustomers);
        assignInstallerNotes(allInfo.notesInstallers);
        assignUserFirstName(allInfo.FirstName);
        assignUserLastName(allInfo.LastName);

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
    const [quotedetails, setquotedetails] = useState([]);
    
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        var quoteInfo = 
        {
            id:quoteID,
            customer_notes: customerNotes,
            installer_notes: installerNotes,
            
            total: getQuoteTotal(quotedetails)
        }
        try{
        await updateQuote(quoteInfo);
        quotedetails.map(async (details) => {
            if(details.id !== null){
                await updateDetail(details).then(() => {
                details.productArr.map(async (prod) => {
                    if(prod.id !== null){
                        
                        await updateProduct(prod);
                    } 
                    else{
                        
                        await addNewProductLine(prod, quoteID, details.id);
                    }
                });
            });
                
            }
            else{
                await addNewDetails(details, quoteID).then(() => {
                     details.productArr.map(async (prod) => {
                    if(prod.id !== null){
                        await updateProduct(prod);
                    } 
                    else{
                        await addNewProductLine(prod, quoteID, details.id);
                    }
                });
                });
               
            }
        });
        message.success("Quote successfully updated");
    }
    catch(e){
        message.error("Something went wrong. Try again in a bit")
    }
    finally{
        history.push('/quotes/quoteList');
    }
        
    }

    const changeTax = () => {
        if (tax === true){
            setTax(false);
        }
        else if (tax === false){
            setTax(true);
        }
    }        
    const addNewDetail = (e) => {
        e.preventDefault();
        setcounter(counter +1);
        var temp = quotedetails;
        if(temp[temp.length] === 0){
            temp[0] = {
                id:null,
                key:detailKey,
                details:"",
                total:0.00,
                productArr:[]
            }
        }
        else{
            temp[temp.length] = {
                id:null,
                key:detailKey,
                details:"",
                total:0.00,
                productArr:[]
            }
        }
        setDetailKey(detailKey + 1);
        setquotedetails(temp);
        console.log(quotedetails);
    }
    const handleAddProduct = (details,e) => {
        e.preventDefault();
        setcounter(counter + 1);
        var temp = quotedetails;
        var index = temp.indexOf(details);
        if(temp[index].productArr.length === 0){
            temp[index].productArr[0] = {
                id:null,
                prodKey:prodKey,
                product:"",
                price:0.00,
                tax:0.00
            }
        }
        else{
            temp[index].productArr[temp[index].productArr.length] = {
                id:null,
                prodKey:prodKey,
                product:"",
                price:0.00,
                tax:0.00
            }
        }
        setProdKey(prodKey + 1);
        setquotedetails(temp);
    }
    const handleRemoveRow = async(details, prod ,e) => {
        e.preventDefault();
        await deleteProduct(prod.id);
        setcounter(counter - 1);
        var temp = quotedetails;
        var index = temp.indexOf(details);
        var prodIndex = temp[index].productArr.indexOf(prod);
        temp[index].productArr.splice(prodIndex,1);
        setquotedetails(temp);
    }
    const handleRemoveDetail = async(details,e) => {
        e.preventDefault();
        details.productArr.forEach(async element => {
            console.log(element.id);
            await deleteProduct(element.id);
        });
        await deleteDetail(details.id);
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
        }
        number = number.toFixed(2);
        prod.tax = number;
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
                                        handleTax(prod, e);
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
        if(quotedetails.length > 0){
            
            quotedetails.forEach((detail) => {
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
                <Button size="sm" variant="primary" onClick={(e) => {handleAddProduct(detail,e)}}>Add Product</Button>
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
                            Customer:<br />
                    <p>{firstName} {lastName}</p>
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
                                <Button onClick={(e) => {addNewDetail(e)}}>Add Details</Button>
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
                    defaultValue={quoteData.customer_notes}
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
                    defaultValue={quoteData.installer_notes}
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
                    
                    <Button size="md" variant="primary" type="submit" className="ant-btn ant-btn-primary">Update Quote</Button>
                </div>
            </div>
        </form>
    );
}

export default QuoteEdit;