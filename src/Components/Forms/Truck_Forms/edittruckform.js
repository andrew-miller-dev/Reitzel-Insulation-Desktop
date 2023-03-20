import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import { editTruck } from '../../../api/trucks';
const {Item} = Form;
const {Option} = Select;

export default function EditTruckForm(props) {
    const [form] = Form.useForm();
    const types = ["foam","loosefill"];
    const options = types.map((item, index) => (
      <Option key={item}>{item}</Option>
    ));

    const finishSubmit = async () => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        const result = await editTruck(value, props.info.id);
    if (result.data && result.data.affectedRows > 0) {
      message.success("Updated truck");
      props.closeForm();
    } 
    }

    return(
        <Form
            form={form}
            onFinish={finishSubmit}
            initialValues={{
                ["truckInfo"]:[props.info.info],
                ["truckPlate"]:[props.info.plate],
                ["truckType"]:[props.info.type]
            }}
            >
                <Item
                label="Truck Info"
              name="truckInfo"
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
                label="License Plate"
              name="truckPlate"
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
                label="Truck Type"
                name="truckType"
                rules={[{
                  required:true,
                  message:"Required"
                }]}>
                  <Select>
                  {options}
                  </Select>
                </Item>
                <Item>
                <Button type="primary" htmlType='submit'>Submit</Button>
                </Item>
        </Form>

    )
}