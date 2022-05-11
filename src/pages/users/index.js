import React, { useState, useEffect } from "react";
import "./index.css";
import { Card, Table, Button, Modal, message, Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getUsers, deleteUser, getRoles, changeDisplay } from "../../api/index";
import NewUserForm from "../../Components/Forms/newuserform";
import ModifyUser from "../../Components/Forms/modifyuserform";
const { confirm } = Modal;

export default function Users() {
  //control the status of adding form modal
  const [addShow, setAddShow] = useState(false);
  const [users, setusers] = useState([]);
  const [count, setCount] = useState(0);
  const [roles, setRoles] = useState([]);
  const [currentForm, setCurrentForm] = useState([]);

  const title = (
    <Button
      onClick={() => {
        setCurrentForm(<NewUserForm count = {changeCount} roleList = {roles} closeForm = {closeModal} />);
        setAddShow(true);
      }}
      type="primary"
    >
      New User
    </Button>
  );

  //for table coloumns
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
              setCurrentForm(<ModifyUser count = {changeCount} roleList = {roles} data = {data} closeForm ={closeModal} />)
              setAddShow(true);
            }}
            
          >
            Modify
          </Button>
          <Button
            type="primary"
            onClick={() => {
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

  //close modal form fuction
  const closeModal = () => {
    setAddShow(false);
  }
  const changeCount =() =>{
    setCount(count + 1);
  }
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
      }
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
          onCancel={closeModal}
          footer={null}
        >
          {currentForm}
        </Modal>
      </Card>
    </div>
  );
}
