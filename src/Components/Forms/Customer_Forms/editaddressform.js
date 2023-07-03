import React, {useEffect, useState} from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Select, Space } from "antd";
import { updateAddress } from '../../../api/customer';


const { Item } = Form;
const { Option } = Select;

export default function EditAddress (props) {
    const [form] = Form.useForm();

    const options = props.regionList.map((item) => (
        <Option key={item.id}>{item.name}</Option>
      ));
    const getRegionName = (reg) => {
        console.log(props.regionList,reg)
        let selRegion = props.regionList.find(({id}) => id === reg);
        return selRegion.name;
      }
    const handleUpdate = async () => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        let result = await updateAddress(props.address.id, value);
        if (result.status === 200) {
            message.success("Successfully updated address information");
        }
        else message.warn("Something went wrong");
        props.close();
    }
    return (
        <>
        <h3>Edit Address</h3>
        <Form form={form}
        labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
        onFinish={handleUpdate}
        initialValues={{
            ["contractorName"]:props.address.contractName,
            ["contractorPhone"]:props.address.contractPhone,
            ["address"]:props.address.address,
            ["postalCode"]:props.address.postalcode,
            ["city"]:props.address.city,
            ["region"]:{label:getRegionName(props.address.region),
                value:props.address.region}
        }}>
            <div style={{display:props.display}}>
                <Item
                label="Contractor Name"
                name="contractorName">
                  <Input />
                </Item>
                <Item
                label="Contractor Phone"
                name="contractorPhone">
                  <Input />
                </Item>
                </div>
              <Item 
              label="Address"
              name="address"
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
              name="postalCode"
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
              <Button type="primary" htmlType='submit'>Update</Button>
        </Form>
        </>
    )
}