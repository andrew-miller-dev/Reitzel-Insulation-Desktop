import React from "react";
import { Input, message, Button, Space, } from "antd";
import "./index.css";
import { withRouter } from "react-router";
import { getUser } from "../../util/storage";

const user = getUser();
const { Search } = Input;
function Searchbar(props) {
  
  const onSearch = (value) => {
    message.success(value);
  };

const buttons = () => {
  console.log(user);
  if (user.SecurityLevel === "salesman"){
    return (
      <Space>
         <Button
         onClick={() => {
          props.history.push('/newcustomer');
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
          props.history.push('/newcustomer');
         }}>
        New Customer
      </Button>
      <Button
      onClick={() => {
        props.history.push('/newestimate')
      }}>
        New Estimate
      </Button>
      </Space>
  )
}

  return (
    <div className="content-searchbar">
      <Search
        allowClear
        className="searchbar"
        placeholder="Search"
        onSearch={onSearch}
        enterButton
      />
      {buttons()}
    </div>
  );
}
export default withRouter(Searchbar);
