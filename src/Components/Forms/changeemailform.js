import { Button, Form, Input, message } from "antd";
import { updateEmail } from "../../api";
const {Item} = Form;

export default function ChangeEmailForm(props) {
    const [form] = Form.useForm();
    const confirmFinish = async() => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        let update = await updateEmail(props.user.UserID, value.emailNew)
        form.resetFields();
        if(update.status === 200){
            props.close();
            message.success("Email updated"); 
        }
        else{
            message.error("Something went wrong")
        }
    }

    return (
        <div>
            <h3>Change Email</h3>
        <Form onFinish={confirmFinish} form = {form}>
            <Item 
            label="New email"
            name="emailNew"
            rules={[
                {
                    type:"email",
                    message:"This is not a valid email"
                },
                {
                     required: true,
                    message: "Required",
                },
                
               
            ]}>
                <Input />
            </Item>
            <Item>
                <Button type="primary" htmlType="submit">Update email</Button>
            </Item>
        </Form>     
        </div>

    )
}