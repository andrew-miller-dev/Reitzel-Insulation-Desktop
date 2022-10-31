import { Select } from "antd";
import { useEffect, useState } from "react";
import { getCustomers } from "../../api/calendar";

export default function FindCustomer(props){
    const [customerList, setCustomerList] = useState([]);

    const options3 = customerList.map((item) => (
        {
          label:`${item.CustFirstName} ${item.CustLastName}`,
          value:`${item.CustomerID}`
        }
    ));
    
    const getCustomerList = async() => {
        const data = await getCustomers();
        setCustomerList(data.data);
    }

    useEffect(() => {
        getCustomerList();
      }, []);
  

    return (
        <div>
            <Select
            showSearch={true}
          style={{width:'200px'}}
          options={options3}
          placeholder="Look up customer by name"
          filterOption={(inputValue, option) =>
            option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={async(value) => {
            let customer = customerList.find((arr) => {
                return arr.CustomerID == value;
            });
            props.setDisplay(customer);
        }}
/>
<br/>
    </div>
)
}