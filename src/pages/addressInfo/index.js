import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Form } from "antd";
import { useRouteMatch } from "react-router-dom";
import {getAllInfo} from "../../api/quoteEditAPI";
const { Item } = Form;
const {format } = require('date-fns-tz')

export default function AddressInfo() {
 
  let match = useRouteMatch('/addressinfo/:address').params.address;
  const [addressInfo, setaddressinfo] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formView] = Form.useForm();
  const [formData, setFormData] = useState([]);
  const [testData, setTestData] = useState([]);

    useEffect(async() => {
        const func = async () => {
          let result2 = await getAllInfo(match);
          console.log(result2);
          setTestData(result2.data);
    };
        func();
        
        if(testData !== []){
          setTableData(createTable());
          setLoaded(true);
        }
        
      }, [tableData.length]);

    const checkDate = (date) => {
      console.log('date', date);
      let returnDate = "";
      if(date === "December 31st, 1969"){
      }
      else{
        returnDate = date;
    }
    return returnDate;
    }
    const createTable = () => {
      let tableList = testData.map((item) => (
        {
          id: item.QuoteID,
          salesman: item.FirstName + " " + item.LastName,
          creationDate: format(new Date(item.creationDate),"MMMM do',' yyyy"),
          modifyDate: checkDate(format(new Date(item.modifyDate), "MMMM do',' yyyy")),
          total: item.QuoteTotal
      }));
      return tableList;
    };

    const columns =[
      
      {
        title:"Salesman",
        dataIndex:"FirstName",
        key:"user"
      },
      {
        title:"Quote Total",
        dataIndex:"QuoteTotal",
        key:"total"
      },
      {
        title:"Show/Edit Quote Info",
        key:"OpenQuote",
        render: (data) => 
          (
            <div>
              <Button
         
          href={`/quoteinfo/${data.id}`}>
          Edit Quote  
          </Button>
            <Button
            onClick={() => {setShowForm(true);
                            setFormData(data);
                            }}>
            View Quote</Button>
            </div>)
      },
      {
        title:"Creation Date",
        dataIndex:"creationDate",
        key:"date"
      },
      {
        title:"Last Modified",
        dataIndex:"modifyDate",
        key:"modDate"
      }   

    ]
    if(loaded){

      return(
        <div>
          <Card title="Customer Information"></Card>
        <Card title="Address Information">
           {addressInfo.address}
           <br />
           {addressInfo.city}
           <br />
          {addressInfo.postal}
        </Card>

        <h2>Active Quotes</h2>
        <Table
        style={{ width: "80%", margin: "0 auto" }}
        rowKey="id"
        dataSource={testData}
        columns={columns}
        tableLayout="auto"
        pagination={{ pageSize: 10 }}>
          </Table>


        <Modal
        visible={showForm}
        title="View Quote"
        onOk={() => {console.log("submit")}}
        onCancel={() => {setShowForm(false)}}>
          <Form 
          form={formView}
          labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Item name="test">

            </Item>
          </Form>
        </Modal>
          </div>
      )
    }

    else{
      return(
        <div>
          Loading...
        </div>
        
      );
      
    }
    }