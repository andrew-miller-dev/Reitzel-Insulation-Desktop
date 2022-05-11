import {Form, message, Select, Input, Button, Modal } from 'antd';
import { useEffect } from 'react';
import { updateUser } from '../../api';
import { updatePassword } from '../../api';
import { sendEmail } from '../../api/calendar';
import { renderEmail } from 'react-html-email';
import ResetPasswordEmail from '../Email_Templates/reset_password';
const crypto = require("crypto");
const { Item } = Form;
const { Option } = Select;


export default function ModifyUser(props) {
    const [form] = Form.useForm();

    const handleUpdate = async () => {
        console.log(props.data);
        //validate first
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        const { loginFirstName, loginLastName, email, role } = value;
        const id = props.data.id;
        //update data in the backend
        const result = await updateUser(id, loginFirstName, loginLastName, email, role);
        console.log(result);
        if (result.status === 200) {
        message.success("Updated user");
        props.count();
        props.closeForm();
        }
      };

      const options = props.roleList.map((item) => (
        <Option key={item.RoleName}>{item.RoleName}</Option>
      ));

      useEffect(()=>{
          form.setFieldsValue({
            key:props.data.id,
            loginFirstName: props.data.loginFirstName,
            loginLastName: props.data.loginLastName,
            email: props.data.email,
            role: props.data.role,
          })
      },[props.data]);

      const resetPassword = () =>{
          Modal.confirm({
              title:"Reset Password",
              content:"This will reset this user's password and send a new one to the email saved on the account. Proceed?",
              onOk(){
                return new Promise(async(resolve, reject) => {
                     var token = crypto.randomBytes(5).toString('hex');
        try{
            let emailCheck = await updatePassword(props.data.email,token);
            if(emailCheck.data.changedRows === 0){
                message.warn("No email found");
            }
            else{ 
            sendEmail(props.data.email, renderEmail(<ResetPasswordEmail newPassword = {token} />),"Password Reset");
            message.success("Password reset");
            resolve();
            props.closeForm();
        }
        }
        catch(e){
            console.log(e);
            message.warn("Something went wrong. Please try again");
        }
                })
        }
              
      })
    }

    return (
        <div>
            <h3>Update</h3>
             <Form onFinish={handleUpdate} form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
              label="Reset Password">
             <Button type="primary" onClick={resetPassword}>Reset</Button>
            </Item>
            <Item
              label="Email"
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
                <Button type="primary" htmlType='submit'>Update</Button>
            </Item>
          </Form>
        </div>
    )
}