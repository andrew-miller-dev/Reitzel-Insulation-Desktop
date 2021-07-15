import React, { useState, useEffect } from "react";
import Button from "../../component/quotes/Button";
import qData from './quoteData';
import { AutoComplete, Form, Input, Checkbox } from 'antd';
import {getCustomers, getCustomerFiltered} from "../../api/quotes"

import Item from "antd/lib/list/Item";
import { createPortal } from "react-dom";
import { render } from "@testing-library/react";
import { PropertiesPanel } from "devextreme-react/diagram";



function QuoteCreate(props){
        let quoteData = qData.quote_data;
        const [tax, setTax] = useState(true);
        const [counter, setcounter] = useState(1);
        const [detailKey, setDetailKey] = useState(1);
        const [prodKey, setProdKey] = useState(1);
        const [quotedetails, setquotedetails] = useState([{
                    key:0,
                    details:"",
                    total:0.00,
                    productArr:[{
                        prodKey:0,
                        product:"",
                        notes:"",
                        price:0.00
                    }]
                }]);
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
                    key:detailKey,
                    details:"",
                    total:0.00,
                    productArr:[]
                }
            }
            else{
                temp[temp.length] = {
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
                    prodKey:prodKey,
                    product:"",
                    notes:"",
                    price:0.00
                }
            }
            else{
                temp[index].productArr[temp[index].productArr.length] = {
                    prodKey:prodKey,
                    product:"",
                    notes:"",
                    price:0.00
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
        const handleProductNotes = (prod, e) => {
            prod.notes = e.target.value;
        }
        const handleProductPrice = (prod, e) => {
            let newPrice = parseFloat(e.target.value);
            let rounded = newPrice.toFixed(2);
            prod.price = rounded;
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
                                    <input type="number" key={prod.prodKey} defaultValue={prod.price}
                                        onChange={(e) => {
                                            handleProductPrice(prod, e);
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
                Products:
                </tr>
                    <tr>
                        {renderProducts(detail)}
                    </tr>
            <tr>
                  <Button size="sm" variant="primary" onClick={(e) => {handleAddProduct(detail,e)}}>Add Product</Button>
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
    
        return (
            <div>
                <table style={{width:"100%"}}>
                        <thead>
                        <tr>
                            <td>Quote Details and Products:</td>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {renderRows()}
                        <Button onClick={(e) => {addNewDetail(e)}}>Add Details</Button>
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
            </div>
        )
}

export default QuoteCreate;