import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import { addTruck} from '../../../api/trucks';
const {Item} = Form;
const {Option} = Select;

export default function NewTruckForm(props) {
    const [form] = Form.useForm();
    const types = ["foam","loosefill"];
    const options = types.map((item, index) => (
      <Option key={item}>{item}</Option>
    ));

    const finishSubmit = async () => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        const result = await addTruck(value);
    if (result.data && result.data.affectedRows > 0) {
      message.success("Added new truck");
      props.closeForm();
    } 
    }

   return(
    <Form
            form={form}
            onFinish={finishSubmit}
            >
                <Item
                label="Truck Number"
              name="truckNumber"
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
                    <Button htmlType='submit'></Button>
                </Item>
        </Form>)
}