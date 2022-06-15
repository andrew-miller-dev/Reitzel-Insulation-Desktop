import { Card, Col, Form, Input, Row, Modal, Button, AutoComplete, Space } from "antd";
import { useEffect, useState } from "react";
import { getAddressList, getCustomers, getRegionAPI } from "../../api/calendar";
import NewCustomerForm from "../Forms/newcustomerform";
const { Item } = Form;

export default function NewCustomerButton(props) {
    const [showForm, setShowForm] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [regions, setRegions] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [selectCustomer, setSelectCustomer] = useState([]);

    const options3 = customerList.map((item) => (
        {
          label:`${item.CustFirstName} ${item.CustLastName}`,
          value:`${item.CustomerID}`
        }
    ));

    const getregions = async () => {
        const data = await getRegionAPI();
        let regionData = data.data.map((item) => ({
          id: item.RegionID,
          region: item.Region,
          color: item.color,
        }));
        setRegions(regionData);
      };

      const getCustomerList = async() => {
          const data = await getCustomers();
          setCustomerList(data.data);
      }

    useEffect(() => {
        getCustomerList();
        getregions();
      }, []);
  
    return (
        <div>
            <Card title="Customer">
            <AutoComplete
          style={{width:'150px'}}
          options={options3}
          placeholder="Look up customer by name"
          filterOption={(inputValue, option) =>
            option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={async(value) => {
            let customer = customerList.find((arr) => {
                return arr.CustomerID == value;
            });
            setSelectCustomer(customer);
            const list = await getAddressList(customer.CustomerID);
            setAddressList(list.data);
            document.getElementById("CustomerInfo").style.display = "block";
        }}
/>
<br/>
                <Button onClick={()=>{setShowForm(true)}}>
                    New Customer
                </Button>
                <div id="CustomerInfo" style={{display:"none"}}>
                    <Card title="Customer">
                      {selectCustomer.CustFirstName}  {selectCustomer.CustLastName} 
                    </Card>
                </div>
            </Card>
       
    <Modal
    width="90%"
    visible={showForm}
    onCancel={()=> {setShowForm(false)}}>
        <NewCustomerForm />
    </Modal> 
    </div>
    )
}