import { Button, Card, Input, Row, Col, Modal } from "antd";
import { useEffect, useState } from "react";
import { GetUserByID } from "../../api";
import ChangeEmailForm from "../../Components/Forms/changeemailform";
import ChangePasswordForm from "../../Components/Forms/changepassword";
import { getUser } from "../../util/storage";

export default function Profile(props) {
    const [user, setUser] = useState([]);
    const [showForm,setShowForm] = useState(false);
    const [content, setContent] = useState({});

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
        setShowForm(false);
        setContent({});
        
    }
    const changePassword = () => {
       setShowForm(true);
       setContent(<ChangePasswordForm user = {user} close={closeForm} />)
    }

    const changeEmail = () => {
        setShowForm(true);
        setContent(<ChangeEmailForm user = {user} close ={closeForm} />)
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
            footer={null}>
            {content}
            </Modal>
        </div>
    )
}