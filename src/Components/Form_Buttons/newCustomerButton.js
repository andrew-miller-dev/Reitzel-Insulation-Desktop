import { Card, Modal, Button, AutoComplete, Select } from "antd";
import { useEffect, useState } from "react";
import { getAddressList, getCustomers, getRegionAPI } from "../../api/calendar";
import NewCustomerForm from "../Forms/newcustomerform";
import { useDispatch, useSelector } from "react-redux";

export default function NewCustomerButton(props) {
    const [showForm, setShowForm] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [selectCustomer, setSelectCustomer] = useState([]);
    const dispatch = useDispatch();
    const select = useSelector((state) => state);

    const options3 = customerList.map((item) => (
        {
          label:`${item.CustFirstName} ${item.CustLastName}`,
          value:`${item.CustomerID}`
        }
    ));

    const optionsAddress = addressList.map((item) => (
      {
        label:`${item.Address}`,
        value:item.AddressID
      }
    ))
    const closeForm = () => {
      setShowForm(false);
    }

      const getCustomerList = async() => {
          const data = await getCustomers();
          setCustomerList(data.data);
      }

      const setDisplay = async(customer) => {
        setSelectCustomer(customer);
        dispatch({type:"customerUpdate", payload:customer});
        console.log(select);
        const list = await getAddressList(customer.CustomerID);
        setAddressList(list.data);
        document.getElementById("CustomerInfo").style.display = "block";
      }

    useEffect(() => {
        getCustomerList();
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
            setDisplay(customer);
        }}
/>
<br/>
                <Button onClick={()=>{setShowForm(true)}}>
                    New Customer
                </Button>
                <div id="CustomerInfo" style={{display:"none"}}>
                    <Card title="Info">
                      {selectCustomer.CustFirstName}  {selectCustomer.CustLastName} <br />
                      {selectCustomer.BillingAddress} <br/>
                      {selectCustomer.CustCity} {selectCustomer.CustPostalCode}
                    </Card>
                    <Card title="Address">
                      <Select style={{width:'150px'}} 
                      options={optionsAddress}
                      onSelect={(value) => {dispatch({type:"addressUpdate",payload:value})}}>
                      </Select>
                    </Card>
                </div>
            </Card>
       
    <Modal
    width="90%"
    visible={showForm}
    onCancel={closeForm}
    footer={false}>
        <NewCustomerForm setDisplay = {setDisplay} close = {closeForm}/>
    </Modal> 
    </div>
    )
}