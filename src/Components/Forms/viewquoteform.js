import React, { useEffect, useState } from "react"
import { getProductList, getQuoteDetails, getQuoteID } from "../../api/quoteEditAPI"
import { Card } from "antd";

export default function ViewQuoteForm (props) {
    const [quoteInfo, setQuoteInfo] = useState([]);
    const [detailInfo, setDetailInfo] = useState([]);
    const [prodInfo, setProdInfo] = useState([]);

    useEffect(() => {
        const func = async() => {
            let quote = await getQuoteID(props.id);
        setQuoteInfo(quote.data[0]);
        let details = await getQuoteDetails(props.id);
        let product = await getProductList(props.id);
        setProdInfo(product.data);
        let detailArr = getDetailsByID(details.data);
        setDetailInfo(detailArr);
        }
      func();  
        
    },[]);

    const getDetailsByID = (arr) => {

        let array = [];
        arr.forEach((item) => {
            array.push({
              quoteID:item.quoteID,
              id:item.subtotalID,
              subtotalLines:item.subtotalLines,
              total:item.subtotalAmount,
              arr:getProductArr(item.SubtotalID)
            });
        });
        return array;
    }

    const getProductArr = (id) => {
        let array = [];
        prodInfo.forEach((item) => {
               if(item.subtotalID === id){
                    array.push({
                      prodID:item.QuoteLineID,
                      product:item.Product,
                      price:item.Subtotal
                    })
                }
            });
            return array;
      }

    const renderDetails = () => {
        let rows = [];
        detailInfo.forEach((item) => {
          rows.push(<Card title="Details" bordered={true} type="inner">
            <p>{item.subtotalLines}</p>
            <strong>Products</strong>
            <table style={{width:'100%'}}>
              <tbody>
                {renderProducts(item.arr)}
              </tbody>
            </table>
            
            <p><strong>Total: </strong>$ {item.total}</p>
          </Card>)
  
        });
        return rows;
      }
      const renderProducts = (array) => {
        let rows = [];
        array.forEach((item) => {
          rows.push(
            <tr width="100px">
              <td>{item.product}</td>
              <td>$ {item.price}</td>
            </tr>
        )})
        return rows;
        }
    return (
        <div>
            {renderDetails()}
        </div>
    )
}