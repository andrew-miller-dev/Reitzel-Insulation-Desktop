import React from "react";
import { Redirect } from "react-router-dom";
import { Layout, Modal, message } from "antd";
import Main from "../main";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./index.css";
import Leftnav from "../leftnav";
import Head from "../head";
import { getUser } from "../../util/storage";
import Searchbar from "../searchbar";
import { datas } from "../../api/index";
const { Header, Content, Footer, Sider } = Layout;
//const { ipcRenderer } = require('electron');
const {confirm} = Modal;

export default class Homepage extends React.Component {
  state = {
    user: "",
  };
  componentDidMount = async () => {
    const user = getUser();
    this.setState({ user });
  };
  render() {
    /*
    ipcRenderer.on('update_available', () => {
      ipcRenderer.removeAllListeners('update_available');
      message("There is a new update. Downloading now.");
    });
    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_downloaded');
      confirm({title:'Update Downloaded. It will be installed on restart. Restart now?', })
    });
  */
    const SecurityLevel =
      (this.state.user && this.state.user.SecurityLevel) || "";
    const FirstName = (this.state.user && this.state.user.FirstName) || "";
    if (!getUser()) return <Redirect to="/login" />;
    return (
      <Layout className="layout">
        <Sider>
          <Leftnav role={SecurityLevel} imgUrl={datas.user[0].imgUrl}></Leftnav>
        </Sider>
        <Layout className="main-layout">
          <Header className="header">
            <Head username={FirstName} />
          </Header>

          <Content className="content">
            <Searchbar role={SecurityLevel} />
            <Main />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            ©2021 Created by Andrew Miller Dev
          </Footer>
        </Layout>
      </Layout>
    );
}
}
