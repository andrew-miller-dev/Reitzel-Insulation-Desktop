import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
import { getLogin, reqWeather, getMenuData } from "../../api/index";
import { setUser, getUser, setMenu, getMenu } from "../../util/storage";
import { Redirect } from "react-router-dom";
import ResetPassword from "../../Components/Forms/newpasswordform";

const { Item } = Form;
export default function Login(props) {
  const [showForm, setShowForm] = useState(false);
  const handleSubmit = async (values) => {
    const { loginId, loginPwd } = values;
    const result = await getLogin(loginId, loginPwd);
    reqWeather("toronto");
    if (result.data && result.data.length > 0) {
      let menuData = await getMenuData(result.data[0]);
      setUser(result.data[0]);
      setMenu(menuData.data[0]);
      if(getUser() && getMenu()){
        props.history.replace("/");
      message.success("Login Success!");
      }
    } else {
      message.info("Username or Password not correct!");
    }
  };
  if (getUser()) return <Redirect to="/" />;
  return (
    <div className="login_page">
      <div className="login">
        <h2>Login</h2>
        <Form onFinish={handleSubmit} autoComplete="off">
          <Item
            name="loginId"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}
          >
            <Input
              style={{ backgroundColor: "transparent" }}
              prefix={<UserOutlined />}
              placeholder="username"
            />
          </Item>
          <Item
            name="loginPwd"
            rules={[
              {
                required: true,
                message: "Cannot be Empty",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="password" />
          </Item>
          <Item className="login_button">
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              size="large"
              block
            >
              Login
            </Button>

            <a style={{fontSize:12}} onClick={() =>{setShowForm(true)}}>Forgot your password?</a>
          </Item>
        </Form>
        <Modal visible={showForm}
        onCancel={()=>{setShowForm(false)}}
        title="Reset Password"
        footer={null}>
          {ResetPassword()}
        </Modal>
      </div>
    </div>
  );
}
