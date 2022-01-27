import React from "react";
import { Input, message, Button, Space, } from "antd";
import "./index.css";
import { withRouter } from "react-router";
import { getMenu, getUser } from "../../util/storage";

const user = getUser();
const { Search } = Input;
function Searchbar(props) {
  
  const onSearch = (value) => {
    message.success(value);
  };

const buttons = () => {
  if (props.role === "salesman"){
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
if(getUser() && getMenu()) {
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
else return (
  <div>
    Loading...
  </div>
)
}
export default withRouter(Searchbar);
