import React, { useState} from "react";
import {useHistory} from "react-router-dom";
import { Button, Space, Modal, Select } from "antd";
import "./index.css";
import { withRouter } from "react-router";
import { getMenu, getUser } from "../../util/storage";
import { customerLookup } from "../../api/customer";
import { SearchAllInfo } from "../../api/quoteEditAPI";
import { SearchAllInfoWO } from "../../api/orders";
import { format } from "date-fns-tz";
import { parseISO } from "date-fns";
import NewCustomerForm from "../../Components/Forms/newcustomerform";
import Refresh from "../../Components/Refresh";
import NewEstimateForm from "../../Components/Forms/newestimateform";
import ViewQuoteForm from "../../Components/Forms/viewquoteform";
import ViewWorkForm from "../../Components/Forms/viewworkform";

function Searchbar(props) {
 const history = useHistory();
  const [customerList, setCustomerList] = useState([]);
  const [quoteList, setQuoteList] = useState({});
  const [orderList, setOrderList] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formOption, setFormOption] = useState(null);

const closeForm = () =>{
  setShowForm(false);
  window.location.reload();
}
const renderCustomer = (data) => {
    const newArr = []
    if(data.length > 0) { 
    data.forEach(element => {
        let obj = {
          label:element.CustFirstName + " " + element.CustLastName + "   " + element.BillingAddress,
          value:"customer" + " " + element.CustomerID
        }
    newArr.push(obj);
  })}
  return newArr
};

const renderQuotes = (data) => {
  const newArr = [];
    if(data.length > 0) { 
    data.forEach(element => {
    newArr.push(renderItemQ(element));
  })}
  return newArr
  };

const renderOrders = (data) => {
  const newArr = [];
    if(data.length > 0) { 
    data.forEach(element => {
    newArr.push(renderItemO(element));
  })}
  return newArr
}

const renderItemQ = (data) => {
  return {
    value:"quote"+ " "+data.QuoteID,
    label:(
      <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>

        {data.CustFirstName} {data.CustLastName} 
        <span>{data.Address}</span>
        <span>Created:{format(parseISO(data.creationDate),"MMMM dd, yyyy")}</span>
        <span>Total: {data.QuoteTotal}</span>
      </div>
    )
  }
}

const renderItemO = (data) => {
  return {
    value:"order"+ " " +data.WorkOrderID,
    label:(
      <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>

        {data.CustFirstName} {data.CustLastName} 
        <span>{data.Address}</span>
        <span>Created:{format(parseISO(data.completeDate),"MMMM dd, yyyy")}</span>
        <span>Total: {data.TotalAmount}</span>
      </div>
    )
  }
}

  const onSearch = async (value) => {
    if(value.length >= 3) {
    let customerResults = await customerLookup(value);
    let customerArr = customerResults.data;
    setCustomerList(customerArr);
    let quoteResults = await SearchAllInfo(value);
    setQuoteList(quoteResults.data);
    let orderResults = await SearchAllInfoWO(value);
    setOrderList(orderResults.data); 
  }
  else {
    setCustomerList([]);
    setQuoteList([]);
    setOrderList([]);
  }
  };

 const checkAndLoad = (item) => {
   let arr = item.value.split(" ");
   let category = arr[0];
   let id = arr[1];

   switch (category) {
     case "customer":
       history.push(`/customers/${id}`);
       break;
     case "quote":
       setFormOption(<ViewQuoteForm id={id} />);
       setShowForm(true);
       break;
     case "order":
      setFormOption(<ViewWorkForm id={id} />);
      setShowForm(true);
       break;
     default:
       console.log("something went very wrong");
       break;
   }
 }
  
const buttons = () => {
  if (props.role === "salesman"){
    return (
      <Space>
         <Button
         onClick={() => {
          history.push('/newcustomer');
         }}>
        New Customer
      </Button>
      </Space>
    )

    
  }
  else return (
<Space>
         <Button
         onClick={() => {
          setFormOption(<NewCustomerForm close = {() => {setShowForm(false)}} />);
          setShowForm(true);
         }}>
        New Customer
      </Button>
      <Button
      onClick={() => {
        setFormOption(<NewEstimateForm close={closeForm} salesman={{id:null,name:null}} />);
        setShowForm(true);
      }}>
        New Estimate
      </Button>
      <Refresh />
      </Space>
  )
}
if(getUser() && getMenu()) {
  return (
    <div className="content-searchbar">
      <Select
      defaultValue={{label:"",value:""}}
      placeholder="Search"
      filterOption={false}
      onSelect={(data) => {
        checkAndLoad(data);
      }}
      showSearch={true}
      dropdownMatchSelectWidth={500}
      labelInValue={true}
      style={{width:300}}
      onSearch={onSearch}
      options={[
        {
          label:"Customers",
          options:renderCustomer(customerList)
        },
        {
          label:"Quotes",
          options:renderQuotes(quoteList)
        },
        {
          label:"Work Orders",
          options:renderOrders(orderList)
        }
       
      ]}>
      </Select>
      {buttons()}

      <Modal
      footer={false}
      destroyOnClose={true}
      visible={showForm}
      onCancel={()=>{setShowForm(false)}}
      width="75%">
        {formOption}
      </Modal>
    </div>
  );
}
else return (
  <div>
    Loading...
  </div>
)
}
export default withRouter(Searchbar);
