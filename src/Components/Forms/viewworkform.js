import React, { useEffect, useState } from "react"
import { Card } from "antd";
import { GetDetailsByWID, GetOrderByID, GetProdsByWID } from "../../api/orders";

export default function ViewWorkForm (props) {
    const [workInfo, setWorkInfo] = useState([]);
    const [detailInfo, setDetailInfo] = useState([]);
    const [prodInfo, setProdInfo] = useState([]);

    useEffect(() => {
        const func = async() => {
            let work = await GetOrderByID(props.id);
            setWorkInfo(work.data[0]);
            let details = await GetDetailsByWID(props.id);
            let product = await GetProdsByWID(props.id);
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
              workID:item.OrderID,
              id:item.WODetailID,
              quoteDetailID:item.SubtotalID,
              details:item.Details,
              total:item.DetailTotal,
              arr:getProductArr(item.WODetailID)
            });
        });
        return array;
    }

    const getProductArr = (id) => {
        let array = [];
        prodInfo.forEach((item) => {
               if(item.WODetailID === id){
                    array.push({
                      prodID:item.WOProdID,
                      product:item.Product,
                      price:item.Price
                    })
                }
            });
            return array;
      }

    const renderDetails = () => {
        let rows = [];
        detailInfo.forEach((item) => {
          rows.push(<Card title="Details" bordered={true} type="inner">
            <p>{item.details}</p>
            <strong>Products</strong>
            <table style={{width:'100%'}}>
              <tbody>
                {renderProducts(item.arr)}
              </tbody>
            </table>
            
            <p><strong>Total: </strong>{item.total}</p>
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
              <td>{item.price}</td>
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