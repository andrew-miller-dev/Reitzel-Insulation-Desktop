import { addUser } from "../../api";
import {Form, message, Input, Button, Select} from 'antd';
const { Item } = Form;
const { Option } = Select;

export default function NewUserForm(props){

const [form] = Form.useForm();
//handle adding form
const handleAdd = async () => {
    const validResult = await form.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
    const value = form.getFieldsValue();
    const { loginFirstName, loginLastName, loginPwd, email, role } = value;
    const result = await addUser({loginFirstName, loginLastName, loginPwd, email, role});
    if (result.data && result.data.affectedRows > 0) {
      message.success("Added new user");
      form.resetFields();
      props.count();
      props.closeForm();
    }
  };

  const options = props.roleList.map((item) => (
    <Option key={item.RoleName}>{item.RoleName}</Option>
  ));

  return(
      <div>
          <h3>New User Creation</h3> 
<Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleAdd}>
<Item
  label="First Name"
  name="loginFirstName"
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
  name="loginLastName"
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
  label="Password"
  name="loginPwd"
  rules={[
    {
      required: true,
      message: "Required",
    },
  ]}
>
  <Input.Password />
</Item>
<Item
  label="Confirm Password"
  name="loginPwdConfirm"
  rules={[
    {
      required: true,
      message: "Required",
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("loginPwd") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          "Passwords must match"
        );
      },
    }),
  ]}
>
  <Input.Password />
</Item>
<Item
  label="Sign-in Email"
  name="email"
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
  label="Role"
  name="role"
  rules={[
    {
      required: true,
      message: "Required",
    },
  ]}
>
  <Select>{options}</Select>
</Item>
<Item>
    <Button type="primary"
            htmlType="submit">
        Submit
    </Button>
</Item>
</Form>
</div>

)
}