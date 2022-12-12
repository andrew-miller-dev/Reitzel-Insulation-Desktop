import { Card, Modal, Button, Select } from "antd";
import { useState } from "react";
import { getAddressList} from "../../api/calendar";
import NewCustomerForm from "../Forms/newcustomerform";
import { useDispatch } from "react-redux";
import FindCustomer from "./findCustomerButton";

export default function NewCustomerButton(props) {
    const [showForm, setShowForm] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [selectCustomer, setSelectCustomer] = useState([]);
    const dispatch = useDispatch();

    const optionsAddress = addressList.map((item) => (
      {
        label:`${item.Address}`,
        value:item.AddressID
      }
    ))
    const closeForm = () => {
      setShowForm(false);
    }

      const setDisplay = async(customer) => {
        setSelectCustomer(customer);
        dispatch({type:"customerUpdate", payload:customer});
        const list = await getAddressList(customer.CustomerID);
        setAddressList(list.data);
        document.getElementById("CustomerInfo").style.display = "block";
      }

    return (
        <div>
          <Card title="Customer">
            <FindCustomer setDisplay={setDisplay} />
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