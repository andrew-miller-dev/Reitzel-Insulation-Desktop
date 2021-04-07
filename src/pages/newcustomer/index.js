import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { addOrder } from "../../api/neworder";
import "./index.css";
const id = 0;
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
  const options = regions.map((item, index) => (
    <Option key={index + 1}>{item}</Option>
  ));
  const onFinish = async (values) => {
    console.log(values);
    var result = await addOrder(values);
    if (result.status == 200) {
      message.success("add success!");
      props.history.push("/customers");
    } else message.warn("fail");
  };
  return (
    <div className="neworder">
      <Form form={form} onFinish={onFinish} wrapperCol={{ span: 14 }}>
        <Item
          name="FirstName"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="First Name" />
        </Item>
        <Item
          name="LastName"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="Last Name" />
        </Item>
        <Item
          name="BillingAddress"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="Billing Address" />
        </Item>
        <Item
          name="City"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="city" />
        </Item>
        <Item
          name="PostalCode"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="PostalCode" />
        </Item>
        <Item
          name="Phone"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="Phone Number" />
        </Item>
        <Item
          name="Email"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Item>
        <Item
          name="Region"
          rules={[
            {
              required: true,
              message: "Cannot be Empty",
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