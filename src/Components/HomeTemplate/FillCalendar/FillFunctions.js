import React from "react";
import {Checkbox} from 'antd';
 
export function createDetails (detlist, prodlist) {
    let temp = [];
    detlist.map((detail) => {
       let detailObj = {
                id: detail.SubtotalID,
                details:detail.subtotalLines,
                total:detail.subtotalAmount,
                selected:false,
                productArr:[]
        }
        prodlist.map((prod) => {
            if(prod.subtotalID === detail.SubtotalID){
                let prodObj = {
                    id:prod.QuoteLineID,
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
                
            }
        })
        if(temp.length === 0){
            temp[0] = detailObj;
        }
        else{
            temp[temp.length] = detailObj;
        }
        return(temp);
    });
    return temp;        
}

export function renderList (array) {
    let rows = [];
    if(array.length > 0){
      array.map((detail) => {
        rows.push(
          <div>
            <tr>
                <td>
                <Checkbox onChange={() => {detail.selected = !detail.selected;}}></Checkbox>
                </td>
          <td colSpan='2' style={{fontSize:"15px"}}>
            {detail.details}
          </td>
        </tr>
          {renderProducts(detail.productArr)}
          <tr>
            <td>

            </td>
            <td style={{fontSize:"15px"}}>
              <b>Total:</b>
            </td>
            <td>
              {detail.total}
            </td>
          </tr>
          </div>
        )
      })
    }
    return rows;
  }

function renderProducts (products) {
    let rows = [];
    products.map((prod) => {
      rows.push(
        <tr>
          <td>
          </td>
          <td>
          </td>
          <td>
            {prod.product}
          </td>
          <td>
            {prod.notes}
          </td>
          <td>
            {prod.price}
          </td>
        </tr>
      )
    })

    return rows;
  }

  export function getTruckType(id, array) {
    let workType = "";
    array.forEach(element => {
      if(element.id === id) {
        workType = element.TruckType;
      }
    });
    return workType;
  }

  export function getSelectedTotal(array) {
    let totalAmt = 0;
    array.forEach(element => {
      if(element.selected) {
        totalAmt = totalAmt + element.total
      }
    });
    return totalAmt;
  }

  export function getSelectedDetails(array) {
    let details = [];
    array.forEach(element => {
      if(element.selected) {
        details.push(element);
      }
    });
    return details;
  }