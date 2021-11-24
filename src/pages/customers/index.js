import React, { useState, useEffect} from "react";
import {Table, Button, Form, Input} from "antd";
import { customerLookup } from "../../api/customer";
import { getCustomers } from "../../api/calendar";
import "./index.css";
import { withRouter } from "react-router";

const {Search} = Input;
function Customers(props) {
  const [customers, setcustomers] = useState([]);
  const [addressList, setaddresses] = useState([]);
  const [form1] = Form.useForm();

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "FirstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "LastName",
    },
    {
      title: "Customer Billing Address",
      dataIndex: "billing",
      key: "BillingAddress",
    },
    {
      title: "See Customer Page",
      key: "OpenCustomer",
      render: (data) => (
        <div className="operate-button">
          <Button
            type="link"
            onClick={() => {
              props.history.push(`/customerinfo/${data.id}`);
            }}
          >
            Show Customer
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const func = async () => {
      var result = await getCustomers();
      var tables = result.data.map((item) => ({
        id: item.CustomerID,
        firstName: item.CustFirstName,
        lastName: item.CustLastName,
        billing: item.BillingAddress,
      }));
      setcustomers(tables);
    };
    func();
  }, []);

  const findCustomers = async (value) => {
    let result = await customerLookup(value);
    var tables = result.data.map((item) => ({
      id: item.CustomerID,
      firstName: item.CustFirstName,
      lastName: item.CustLastName,
      billing: item.BillingAddress,
    }));
    setcustomers(tables);
  }
  return (
    <div>
      <h2>Customers</h2>
      <Search
      style={{width:"40%", padding:"5px"}}
      className="searchbar"
      size = "medium"
      enterButton="Find Customer"
      placeholder="Search customer list"
      onChange={(e) => {findCustomers(e.target.value)}} />

      <Table
      style={{ width: "80%", margin: "0 auto" }}
      rowKey="id"
      bordered
      dataSource={customers}
      columns={columns}
      tableLayout="auto"
      pagination={{ pageSize: 10 }}
    ></Table>
    </div>
    
  );
}
export default withRouter(Customers);
