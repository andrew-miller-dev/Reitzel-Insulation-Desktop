import { Form, Input, Button, message } from "antd";
import { updatePassword } from "../../api";

const {Item} = Form;


export default function ChangePasswordForm(props) {
    
    const [form] = Form.useForm();

    const changePasswordConfirm = async(values) => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        let update = await updatePassword(props.user.Email,value.loginPwd);
        form.resetFields();
        if(update.status === 200){
            props.close();
            message.success("Password updated"); 
        }
        else{
            message.error("Something went wrong")
        }
        
        
    }
    return (
        <div>
            <h3>Change Password</h3>
            <Form onFinish={changePasswordConfirm}
            labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} form={form}>
            <Item
  label="New Password"
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
                <Item>
                    <Button style={{float:"right"}} type="primary" htmlType="submit">
                        Change Password
                    </Button>
                </Item>
            </Form>
        </div>
    )
}