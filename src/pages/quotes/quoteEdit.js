import { getAddressID, getCustomerID, getQuoteDetails, getUserID, getProductList, getQuoteID, updateQuote, updateDetail, updateProduct, deleteProduct, deleteDetail } from "../../api/quoteEditAPI";
import {addNewDetails, addNewProductLine} from '../../api/quotes';
import React, {useState, useEffect} from 'react';
import Button from "../../component/quotes/Button";
import {useInput} from '../../hooks/input-hook';
import {Row, Col, Card, Checkbox} from 'antd';
import { useRouteMatch } from "react-router-dom";

function QuoteEdit (props) {
    let quoteID = useRouteMatch('/quoteinfo/:qid').params.qid;
    const [isLoading, setLoading] = useState(true);

    const {value, bind, reset} = useInput('');
    const [quoteData, setQuoteData] = useState([]);
    const [quoteDetail, setQuoteDetail] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [addressData, setAddressData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [productList, setProductList] = useState([]);
    const [detailKey, setDetailKey] = useState(0);
    const [prodKey, setProdKey] = useState(0);

    useEffect(async () => {
        try {
            let quote = await getQuoteID(quoteID);
            let quoteInfo = quote.data[0];
            setQuoteData(quoteInfo);
            let customerInfo = await getCustomerID(quoteInfo.CustomerID);
            setCustomerData(customerInfo.data[0]);
            console.log(customerInfo.data[0]);
            let addressInfo = await getAddressID(quoteInfo.AddressID);
            setAddressData(addressInfo.data[0]);
            let detailList = await getQuoteDetails(quoteInfo.QuoteID);
            setQuoteDetail(detailList.data);
            console.log(detailList.data);
            let products = await getProductList(quoteInfo.QuoteID);
            setProductList(products.data);
            console.log(products.data);
            let user = await getUserID(quoteInfo.UserID);
            setUserData(user.data[0]);
            console.log(user.data[0]);
            createDetails(detailList.data, products.data);
            setText(customerInfo.data[0], addressInfo.data[0], quoteInfo, user.data[0]);            

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setcounter(counter + 1);
        console.log(quotedetails);
        },[]);
 

    const createDetails = (detlist, prodlist) => {
        let temp = quotedetails;
        detlist.map((detail) => {
           let detailObj = {
                    id: detail.subtotalID,
                    key:detailKey,
                    details:detail.subtotalNotes,
                    total:detail.subtotalAmount,
                    productArr:[]
                
            }
            setDetailKey(detailKey + 1);
            prodlist.map((prod) => {
                if(prod.subtotalID === detail.subtotalID){
                    let prodObj = {
                        id:prod.QuoteLineID,
                        key:prodKey,
                        product:prod.Product,
                        notes:prod.Notes,
                        price:prod.Subtotal
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
    const setText = (customerInfo, addressInfo, quoteInfo, userInfo) => {
        assignCustID(customerInfo.CustomerID);
        assignFirstName(customerInfo.CustFirstName);
        assignLastName(customerInfo.CustLastName);
        assignPhoneNumber(customerInfo.Phone);
        assignEmail(customerInfo.Email);
        assignBillingAddress(customerInfo.BillingAddress);
        assignCity(customerInfo.CustCity);
        assignPostCode(customerInfo.CustPostalCode);
        assignSiteAddress(addressInfo.Address);
        assignSiteCity(addressInfo.City);
        assignSiteCode(addressInfo.PostalCode);
        assignSiteProv(addressInfo.Province);
        assignCustomerNotes(quoteInfo.notesCustomers);
        assignInstallerNotes(quoteInfo.notesInstallers);
        assignUserFirstName(userInfo.FirstName);
        assignUserLastName(userInfo.LastName);

    setcounter(counter + 1);
    }

    const {value: custID, bind: bindCustID, reset: resetCustID, assignValue: assignCustID} = useInput();
    const {value: firstName, bind: bindFirstName, reset: resetFirstName,assignValue: assignFirstName} = useInput();
    const {value: lastName, bind: bindLastName, reset: resetLastName,assignValue: assignLastName} = useInput();
    const {value: billingAddress, bind: bindBillingAddress, reset: resetBillingAddress, assignValue: assignBillingAddress} = useInput();
    const {value: city, bind: bindCity, reset: resetCity, assignValue: assignCity} = useInput();
    const {value: postCode, bind: bindPostCode, reset: resetPostCode,assignValue: assignPostCode} = useInput();
    const {value: phoneNumber, bind: bindPhoneNumber, reset: resetPhoneNumber, assignValue: assignPhoneNumber} = useInput();
    const {value: email, bind: bindEmail, reset: resetEmail, assignValue: assignEmail} = useInput();

    const {value: addressID, bind: bindAddressID, reset: resetAddressID, assignValue: assignAddressID} = useInput();
    const {value: siteAddress, bind: bindSiteAddress, reset: resetSiteAddress, assignValue: assignSiteAddress} = useInput();
    const {value: siteCity, bind: bindSiteCity, reset: resetSiteCity, assignValue: assignSiteCity} = useInput();
    const {value: siteCode, bind: bindSiteCode, reset: resetSiteCode,assignValue: assignSiteCode} = useInput();
    const {value: siteProv, bind: bindSiteProv, reset: resetSiteProv, assignValue: assignSiteProv} = useInput();
    
    const {value: customerNotes, bind: bindCustomerNotes, reset: resetCustomerNotes, assignValue: assignCustomerNotes} = useInput();
    const {value: installerNotes, bind: bindInstallerNotes, reset: resetInstallerNotes, assignValue: assignInstallerNotes} = useInput();

    const {value: userFirstName, bind: bindUserFirstName, reset: resetUserFirstName, assignValue: assignUserFirstName} = useInput();
    const {value: userLastName, bind: bindUserLastName, reset: resetUserLastName, assignValue: assignUserLastName} = useInput();

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
        console.log('details',quotedetails);
        await updateQuote(quoteInfo);
        quotedetails.map(async (details) => {
            if(details.id !== null){
                await updateDetail(details).then(() => {
                details.productArr.map(async (prod) => {
                    if(prod.id !== null){
                        console.log("prod found");
                        let prodEdit = await updateProduct(prod);
                    } 
                    else{
                        console.log("prod not found");
                        let newProd = await addNewProductLine(prod, quoteID, details.id);
                    }
                });
            });
                

            }
            else{
                await addNewDetails(details, quoteID).then(() => {
                     details.productArr.map(async (prod) => {
                    if(prod.id !== null){
                        let prodEdit = await updateProduct(prod);
                    } 
                    else{
                        let newProd = await addNewProductLine(prod, quoteID, details.id);
                    }
                });
                });
               
            }
        })
    }

    const changeTax = () => {
        if (tax == true){
            setTax(false);
        }
        else if (tax == false){
            setTax(true);
        }
    }        
    const addNewDetail = (e) => {
        e.preventDefault();
        setcounter(counter +1);
        var temp = quotedetails;
        if(temp[temp.length] == 0){
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
        if(temp[index].productArr.length == 0){
            temp[index].productArr[0] = {
                id:null,
                prodKey:prodKey,
                product:"",
                notes:"",
                price:0.00
            }
        }
        else{
            temp[index].productArr[temp[index].productArr.length] = {
                id:null,
                prodKey:prodKey,
                product:"",
                notes:"",
                price:0.00
            }
        }
        setProdKey(prodKey + 1);
        setquotedetails(temp);
    }
    const handleRemoveRow = async(details, prod ,e) => {
        e.preventDefault();
        console.log(prod.id);
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
        console.log(details.id);
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
    const handleProductNotes = (prod, e) => {
        prod.notes = e.target.value;
    }
    const handleProductPrice = (prod, e) => {
        if(e.target.value == ""){
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
                details.productArr.map((prod) => {

                    rows.push(
                         <tr>
                             <td>
                                 Product:
                                 <input type="text" key={prod.prodKey}  defaultValue={prod.product}
                                    onChange={(e) => {
                                        handleProductDetails(prod, e);
                                     }}
                                     className="ant-input"
                                     />
        
                             </td>
                            <td>
                                Details:
                                <input type="text" key={prod.prodKey} defaultValue={prod.notes}
                                    onChange={(e) => {
                                        handleProductNotes(prod, e);
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
            total = total * 1.13;
        }
        total = total.toFixed(2);
        details.total = total;
        return total;
    }
    const getQuoteTotal = (detail) => {
        let total = 0.00;
        detail.map((item) => {
            total = total + parseFloat(item.total);
        });
        total = total.toFixed(2);
        return total;
    }
    const renderRows = () => {
        let rows = [];
        if(quotedetails.length > 0){
            
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
                    Province:
                    <p>{siteProv}</p>
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
                                    Apply tax <Checkbox defaultChecked = {true} onChange={() => {changeTax()}}></Checkbox>
                                </td>
                                </tr>
                                <tr>
                                <td style={{textAlign:"right"}}>
                                    Quote Total: ${getQuoteTotal(quotedetails)}
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