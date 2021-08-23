import React, { useEffect, useState } from "react";
import "./index.css";
import { Card, Table, Button, Modal, Form, Input, message, TreeSelect } from "antd";
import { addRole, deleteRole, getRoles, updateRole } from "../../api/index";
import { manuList } from "../../config/leftnav";
const { Item } = Form;

export default function Roles() {
  //control the adding form status
  const [addingShow, setaddingShow] = useState(false);
  //control the modify tree component status
  const [modifyShow, setmodifyShow] = useState(false);
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  //handle the selected row
  const [row, setRow] = useState({});
  //handle the menu of the selected row
  const [roleList, setRoleList] = useState([]);
  //the added role name
  const columns = [
    {
      title: "Role Name",
      dataIndex: "RoleName",
      key: "rolename",
    },
    {
      title: "Create Time",
      dataIndex: "createtime",
      key: "createtime",
    },
    {
      title: "Created By",
      dataIndex: "authorizor",
      key: "authorizor",
    }
  ];

  useEffect( () => {
    let func = async() => {
      let roleData = await getRoles();
      setRoleList(roleData.data);
    }
    func();
  },[roleList.length])
  //getting tree nodes
  const getTreeNodes = (array) => {
    return array.map((item, index) => {
      return {
        title: item.content,
        key: item.key,
        children: item.children ? getTreeNodes(item.children) : "",
      };
    });
  };
  //the data format of tree component
  const treeDatas = [
    {
      title: "Authority",
      key: "All",
      children: getTreeNodes(manuList),
    },
  ];

  //handle tree component(settings for role)
  const handleTree = async () => {
    const validResult = await formEdit.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
    const values = formEdit.getFieldsValue();
    const role = row;
    let menu = "";
    values.treeAccess.map ((item) => {
      menu = menu + item + ", "
    });
    const result = await updateRole(menu, role);
    if(result.status === 200) {
      message.success("Updated role");
    } else {
      message.warn("Something went wrong");
    }
    setmodifyShow(false);
  };
  //handle onrow callback function in table settings
  const handleonRow = (record, index) => {
    return {
      onClick: () => {
        setRow(record);
        console.log(row.rolename);
      },
    };
  };
  //handle adding a new role
  const handleAdding = async () => {
    const validResult = await form.validateFields();
    if (validResult.errorFields && validResult.errorFields.length > 0) return;
    const rolename = form.getFieldValue("rolename");
    const result = await addRole(rolename);
    console.log(result);
    if (result.status === 200) {
      message.success("Added new role");
      setaddingShow(false);
    } else {
      message.warn("Something went wrong");
      setaddingShow(false);
    }
    setaddingShow(false);
  };

  //handle all form status being cancel
  const handleCancel = () => {
    setaddingShow(false);
    setmodifyShow(false);
  };

  const deleteSelected = async() => {
    Modal.confirm({
      title:"Are you sure you want to delete this role?",
      onOk() { return new Promise(async(resolve, reject) => {
        await deleteRole(row.RoleID).then((item) => {
          resolve();
        });
      })
        },
      cancelText:'No',
      okText:'Yes'
    });
  }

  //the title of card component
  const title = (
    <>
      <Button
        style={{ marginRight: 20 }}
        type="primary"
        onClick={() => {
          form.resetFields();
          setaddingShow(true);
        }}
      >
        Create A Role
      </Button>
      <Button
        style={{marginRight:20}}
        type="primary"
        onClick={() => {
          formEdit.resetFields();
          setmodifyShow(true);
        }}
        disabled={!row.RoleID}
      >
        Set Roles
      </Button>
      <Button
        type="primary"
        onClick={() => {
          deleteSelected();
        }}
        disabled={!row.RoleID}
      >
        Delete Role
      </Button>
    </>
  );

  return (
    <Card title={title} bordered>
      <Table
        rowKey="RoleID"
        columns={columns}
        rowSelection={{
          type: "radio",
          selectedRowKeys: [row.RoleID],
          onChange: (rowkeys, rows) => {
            setRow(rows[0]);
          },
        }}
        onRow={handleonRow}
        dataSource={roleList}
      ></Table>
      <Modal
        visible={addingShow}
        onOk={handleAdding}
        onCancel={handleCancel}
        title="Adding a role"
      >
        <Form form={form}>
          <Item
            name="rolename"
            label="Role Name"
            rules={[
              {
                required: true,
                message: "Please input a role name",
              },
            ]}
          >
            <Input />
          </Item>
        </Form>
      </Modal>
      <Modal
        visible={modifyShow}
        title="Set role privileges"
        onOk={handleTree}
        onCancel={handleCancel}
      >
        <Form form={formEdit}>
          <Item label="Role:" wrapperCol={{ span: 18 }}>
            <Input disabled value={row.RoleName} />
          </Item>
          <Item
          label="Access"
          name="treeAccess">
             <TreeSelect treeCheckable={true} treeData={treeDatas}></TreeSelect>
          </Item>
        </Form>
      </Modal>
    </Card>
  );
}
