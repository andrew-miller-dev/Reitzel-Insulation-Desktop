import { Button, Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { sendEmail } from "../../api/calendar";
import { renderEmail } from "react-html-email";
import ResetPasswordEmail from "../Email_Templates/reset_password";
import { updatePassword } from "../../api";
const {Item} = Form;
const crypto = require("crypto");

export default function ResetPassword(props) {
    const CompleteReset = async(values) =>{
       var token = crypto.randomBytes(5).toString('hex');
        try{
            let emailCheck = await updatePassword(values.email,token);
            if(emailCheck.data.changedRows === 0){
                message.warn("No email found");
            }
            else{ 
            sendEmail(values.email, renderEmail(<ResetPasswordEmail newPassword = {token} />),"Password Reset");
            message.success("Password reset");
        }
        }
        catch(e){
            console.log(e);
            message.warn("Something went wrong. Please try again");
        }
        }
    return(
        <div>
            <p>This will reset your password and a new password will be sent to your email. Please use the new password and change your password once you log in.</p>
            <p>Please enter your email below to reset your password</p>
    <Form onFinish={CompleteReset}>
        <Item 
        name="email">
            <Input 
                    placeholder="Email address"
                    prefix={<MailOutlined />} />
        </Item>
        <Item>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Item>    
    </Form>
    </div>
  )
}