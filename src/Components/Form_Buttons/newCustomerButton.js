import { Card, Modal, Button, Select } from "antd";
import { useEffect, useState } from "react";
import { getAddressList} from "../../api/calendar";
import NewCustomerForm from "../Forms/newcustomerform";
import { useDispatch } from "react-redux";
import FindCustomer from "./findCustomerButton";


export default function NewCustomerButton(props) {
    const [showForm, setShowForm] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [selectCustomer, setSelectCustomer] = useState([]);
    const dispatch = useDispatch();
    const [option, setOption] = useState(false); 

    const optionsAddress = addressList.map((item) => (
      {
        label:`${item.Address}`,
        value:item.AddressID
      }
    ));
    const closeForm = () => {
      setShowForm(false);
    }

    useEffect(() => {return null},[addressList]);

      const setDisplay = async(customer) => {
        setSelectCustomer(customer);
        dispatch({type:"customerUpdate", payload:customer});
        const list = await getAddressList(customer.CustomerID);
        setAddressList(list.data);
        if(addressList.length === 1) {
          let list = document.getElementById('addressSelect');
          list.value = addressList[0].Address;
        }
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
                      <Select
                      id='addressSelect'
                      style={{width:'150px'}}
                      showSearch={true}
                      disabled={option}
                      defaultActiveFirstOption={true}
                      filterOption={(inputValue, option) =>
                        option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
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