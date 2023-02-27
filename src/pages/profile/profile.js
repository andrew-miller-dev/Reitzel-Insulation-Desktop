import { Button, Card, Input, Row, Col, Modal, Form, message } from "antd";
import { useEffect, useState } from "react";
import { GetUserByID } from "../../api";
import ChangeEmailForm from "../../Components/Forms/changeemailform";
import ChangePasswordForm from "../../Components/Forms/changepassword";
import { getUser } from "../../util/storage";

const {Item} = Form;
export default function Profile(props) {
    const [user, setUser] = useState([]);
    const [showForm,setShowForm] = useState(false);
    const [content, setContent] = useState({});
    const [form] = Form.useForm();

    useEffect(() =>{
        const func = async() => {
        setUser(getUser());
        const userInfo = getUser();
        const userInfoNew = await GetUserByID(userInfo.UserID);
        setUser(userInfoNew.data[0])
        }
        func();
    },[])

    const closeForm = () => {
        form.resetFields();
        setShowForm(false);
        setContent({});
        
    }
    const confirmOldPass = async(values) => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        if(value.oldConfirm === user.Password) {
            setContent(<ChangePasswordForm user = {user} close={closeForm} />)
        }
        else {
            message.error("Password not correct");
        }
    }
    const confirmPassEmail= async(values) => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
        if(value.oldConfirm === user.Password) {
            setContent(<ChangeEmailForm user = {user} close={closeForm} />)
        }
        else {
            message.error("Password not correct");
        }
    }
    const changePassword = () => {
       setShowForm(true);
       setContent(
       <>
       <h3>Change Password</h3>
       <Form form={form} onFinish={confirmOldPass}>
        <Item 
        label="Confirm old password"
        name="oldConfirm"
        rules={[
            {
                required:true,
                message:"Required"
            }
        ]}>
            <Input.Password />
        </Item>
        <Item>
        <Button htmlType="submit" style={{float:"right"}} type="primary">Submit</Button>
        </Item>
       </Form>
       </>)
    }

    const changeEmail = () => {
        setShowForm(true);
        setContent(
            <>
            <h3>Change Password</h3>
            <Form form={form} onFinish={confirmPassEmail}>
             <Item 
             label="Confirm password"
             name="oldConfirm"
             rules={[
                 {
                     required:true,
                     message:"Required"
                 }
             ]}>
                 <Input.Password />
             </Item>
             <Item>
             <Button htmlType="submit" style={{float:"right"}} type="primary">Submit</Button>
             </Item>
            </Form>
            </>)
    }
    return (

        <div>
            <h2>Profile</h2>

            <Card title="User Info">
                <Row gutter={[15,15]}>
                    <Col span={2}>
                     <b>Name:</b>
                    </Col>
                    <Col>
                    {user.FirstName} {user.LastName}
                    </Col>
                </Row>
                <Row gutter={[15,15]}>
                    <Col span={2}>
                        <b>Sign-In email:</b> 
                    </Col>
                    <Col span={4}> {user.Email}
                    </Col>
                    <Col> <Button onClick={changeEmail}>Change Email</Button>
                    </Col>
                </Row>
                <Row gutter={[15,15]}>
                    <Col span={2}> <b>Password:</b>
                    </Col>
                    <Col span={4}><Input.Password
                    disabled
                     style={{minWidth:"200px",maxWidth:"300px"}} 
                     value={user.Password}
                     ></Input.Password>
                    </Col>
                    <Col> <Button onClick={changePassword}>Change Password</Button>
                    </Col>
                </Row>
                <Row gutter={[15,15]}>
                    <Col span={2}> <b>Role:</b>
                    </Col>
                    <Col>  {user.SecurityLevel}
                    </Col>
                </Row>
               
            </Card>
            <Modal visible={showForm}
            onCancel={closeForm}
            footer={null}
            destroyOnClose={true}>
            {content}
            </Modal>
        </div>
    )
}