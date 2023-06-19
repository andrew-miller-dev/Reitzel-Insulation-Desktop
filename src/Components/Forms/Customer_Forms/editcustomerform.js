import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Select, Switch } from "antd";
import { updateCustomer } from '../../../api/customer';



const { Item } = Form;
const { Option } = Select;

export default function EditCustomerForm(props) {
    const [form1] = Form.useForm();

    const options = props.regionList.map((item) => (
        <Option key={item.id}>{item.name}</Option>
      ));

    const handleUpdate = async () => {
        const validResult = await form1.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form1.getFieldsValue();
        console.log(value);
        let num = value.contractor ? 1 : 0;
        const id = props.data.id;
        const postal = value.postal || " ";
        //update data in the backend
        const result = await updateCustomer(id, value.firstName, value.lastName, value.email, value.phone, value.billing, value.city, postal, value.region.value, num);
        
        if (result.status === 200) {
          message.success("Successfully updated customer information");
        }
        props.close();
      };

      const getRegionName = (reg) => {
        console.log(props.regionList,reg)
        let selRegion = props.regionList.find(({id}) => id === reg);
        return selRegion.name;
      }
    return (
        <>
        <h3>Edit Customer</h3>
        <Form form={form1} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleUpdate}
            initialValues={{
                ["firstName"]:props.data.firstName,
                ["lastName"]:props.data.lastName,
                ["email"]:props.data.email,
                ["phone"]:props.data.phone,
                ["billing"]:props.data.billing,
                ["city"]:props.data.city,
                ["postal"]:props.data.postal,
                ["region"]:{label:getRegionName(props.data.region),
                            value:props.data.region}
            }}>
        <Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
                
              ]}
              
            >
              <Input />
            </Item>
            <Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Email"
              name="email"
            >
              <Input />
            </Item>
            <Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Billing Address"
              name="billing"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label="Postal Code"
              name="postal"
            >
              <Input />
              </Item>
              <Item
              label="Region"
              name="region"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Select labelInValue>{options}</Select>
            </Item>
            <Item
            label="Contractor"
            name="contractor"
            >
              <Switch defaultChecked={props.data.contractor} />
            </Item>
            <Button type='primary' htmlType='submit'>Update</Button>
        </Form>
        
        </>
    )
}