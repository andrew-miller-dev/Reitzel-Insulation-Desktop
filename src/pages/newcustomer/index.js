import React, {useState} from "react";
import { Form, Input, Button, Select, message } from "antd";
import { addOrder, getLatestCustomer, addAddress } from "../../api/neworder";
import "./index.css";
import validator from "validator";
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
};
const { Item } = Form;
const { Option } = Select;
export default function NewCustomer(props) {
  const [form] = Form.useForm();
  const regions = [
    "Elmira & area",
    "Guelph & area",
    "Cambridge & area",
    "Hamilton & area",
    "Stratford & area",
    "Listowel area",
    "Greater Toronto Area",
    "Kitchener - Waterloo",
    "Brantford, Paris, Burford, Waterford, Brant County, Haldmald, Caledonia",
  ];
  const [validEmail, setValidEmail] = useState('');
  const [errorColor, setErrorColor] = ('red');
  const options = regions.map((item, index) => (
    <Option key={index + 1}>{item}</Option>
  ));
  const onFinish = async (values) => {
    let newVal = {
      BillingAddress : values.BillingAddress,
      City: values.City,
      Email: values.Email,
      FirstName:values.FirstName,
      LastName:values.LastName,
      Phone:values.Phone,
      PostalCode:values.PostalCode,
      Prov:values.Prov,
      Region:values.Region
    }
    await addOrder(newVal);
    var customerID = await getLatestCustomer();
    var latestCustomer = customerID.data[0].CustomerID;
    var newAddress = await addAddress(latestCustomer, newVal);
    console.log("new address",newAddress);
    if (newAddress.status == 200) {
      message.success("Added successfully");
      props.history.push("/customers");
    } else message.warn("Something went wrong");
  };
  const emailCheck = (value) => {
    let word = value.target.value;
    if(validator.isEmail(word)){
      setValidEmail('Valid email');
      setErrorColor('green');
    }
    else {
      setValidEmail('Not a valid email');
      setErrorColor('red');
    }
  }
  return (
    <div className="neworder">
      <Form form={form} onFinish={onFinish} {...layout}>
        <Item
        label="First Name"
          name="FirstName"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="First Name" />
        </Item>
        <Item
        label="Last Name"
          name="LastName"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="Last Name" />
        </Item>
        <Item
        label="Address"
          name="BillingAddress"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="Billing Address" />
        </Item>
        <Item
          label="City"
          name="City"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="City" />
        </Item>
        <Item
          label="Province"
          name="Prov"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="Province" />
        </Item>
        <Item
          label="Postal Code"
          name="PostalCode"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="Postal Code" />
        </Item>
        <Item
          label="Phone"
          name="Phone"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Input placeholder="Phone Number" />
        </Item>
        <Item
          label="Email"
          name="Email"
          rules={[{
            required: true,
            message:"Required Field"
          }]}
        >
          <Input onChange={emailCheck} placeholder="Email" />
        </Item>
        <Item
            label="Email Check">
              <span 
              style={{
                fontSize:12,
                color:errorColor
              }}>
          {validEmail}
          </span>
            </Item>
        <Item
          label="Region"
          name="Region"
          rules={[
            {
              required: true,
              message: "Required Field",
            },
          ]}
        >
          <Select>{options}</Select>
        </Item>
        <Item className="login_button">
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            size="large"
            block
          >
            Add
          </Button>
        </Item>
      </Form>
    </div>
  );
}
