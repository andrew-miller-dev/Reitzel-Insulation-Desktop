import React, { useState, useEffect } from "react";
import "./index.css";
import { Card, Table, Button, Modal, Form, Input, message, Select, Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { addUser, getUsers, updateUser, deleteUser, getRoles, changeDisplay } from "../../api/index";
const { Item } = Form;
const { confirm } = Modal;
const { Option } = Select;
export default function Users() {
  //form ref to control the adding form
  const [form] = Form.useForm();
  //form ref to control the updating form
  const [form1] = Form.useForm();
  //control the status of adding form modal
  const [addShow, setAddShow] = useState(false);
  //control the status of updating form modal
  const [updateShow, setupdateShow] = useState(false);
  const [, setForce] = useState();
  const [users, setusers] = useState([]);
  const [count, setCount] = useState(0);
  const [roles, setRoles] = useState([]);


  //the selected to be updated or deleted data
  const [selectedData, setselectedData] = useState({});
  const title = (
    <Button
      onClick={() => {
        form.resetFields();
        setAddShow(true);
      }}
      type="primary"
    >
      New User
    </Button>
  );

  const options = roles.map((item) => (
    <Option key={item.RoleName}>{item.RoleName}</Option>
  ));

  //for table coloums
  const columns = [
    {
      title: "Name",
      key: "loginId",
      render:(data) => (
        <p>{data.loginFirstName} {data.loginLastName}</p>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Settings",
      key: "operate",
      render: (data) => (
        <div className="operate-button">
          <Button
            type="primary"
            onClick={() => {
              setselectedData(data);
              console.log(data);
              setupdateShow(true);
              form1.setFieldsValue({
                key:data.id,
                loginFirstName: data.loginFirstName,
                loginLastName: data.loginLastName,
                loginPwd: data.loginPwd,
                loginPwdConfirm: data.loginPwdConfirm,
                email: data.email,
                role: data.role,
              });
            }}
          >
            Modify
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setselectedData(data);
              showDeleteConfirm(data.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
    {
      title:"Display on Home",
      render:(data) => (
        <div>
          <Switch
          checked={data.display}
          onChange={() => changeDisp(data)} />
        </div>
      )
    }
  ];
  //handle adding form
  const handleAdd = async () => {
    const validResult = await form.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
    const value = form.getFieldsValue();
    const { loginFirstName, loginLastName, loginPwd, email, role } = value;
    const result = await addUser({loginFirstName, loginLastName, loginPwd, email, role});
    if (result.data && result.data.affectedRows > 0) {
      message.success("Added new user");
      setAddShow(false);
      setForce();
      setCount(count + 1);
    }
  };
  //handle updating form
  const handleUpdate = async () => {
    //validate first
    const validResult = await form1.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
    const value = form1.getFieldsValue();
    const { loginFirstName, loginLastName, loginPwd, email, role } = value;
    const id = selectedData.id;
    //update data in the backend
    const result = await updateUser(id, loginFirstName, loginLastName, loginPwd, email, role);
    setupdateShow(false);
    console.log(result);
    if (result.status === 200) {
      message.success("Updated user");
    }
  };

  const handleCancel = () => {
    setAddShow(false);
    setupdateShow(false);
  };
  //handle delete user function
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise(async(resolve, reject) => {
          const result = await deleteUser(id);
          console.log(result);
          if (result.status === 200) message.success("Successfully deleted user");
          resolve();
          setCount(count + 1);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    const func = async () => {
      var result = await getUsers();
      var tables = result.data.map((item) => ({
        id: item.UserID,
        loginFirstName: item.FirstName,
        loginLastName: item.LastName,
        loginPwd: item.Password,
        email: item.Email,
        role: item.SecurityLevel,
        display:item.Display
      }));
      setusers(tables);
      var roles = await getRoles();
      setRoles(roles.data);
    };
    func();
  }, [users.length, count]);

  const changeDisp = async(data) => {
    let change = !data.display ? 1 : 0;
    let changeNum = change ? 1:0;
    data.display = changeNum;
    let result = await changeDisplay(data);
    if(result.status === 200) {
      message.success("Home screen display changed");
    }
    else{
      message.warning("Update failed")
    }
    setCount(count + 1);
    }
  return (
    <div className="settings-user">
      <Card title={title} bordered>
        <Table
          style={{ width: "80%", margin: "0 auto" }}
          rowKey="id"
          bordered
          dataSource={users}
          columns={columns}
          tableLayout="auto"
          pagination={{ pageSize: 5 }}
        ></Table>
        <Modal
          visible={addShow}
          title="Create A New User"
          onOk={handleAdd}
          onCancel={handleCancel}
        >
          <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
          </Form>
        </Modal>
        <Modal
          visible={updateShow}
          title="Update"
          onOk={handleUpdate}
          onCancel={handleCancel}
        >
          <Form form={form1} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
