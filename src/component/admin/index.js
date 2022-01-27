import React from "react";
import { Redirect } from "react-router-dom";
import { Layout } from "antd";
import Main from "../main";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./index.css";
import Leftnav from "../leftnav";
import Head from "../head";
import { getUser } from "../../util/storage";
import Searchbar from "../searchbar";
import { datas } from "../../api/index";
const { Header, Content, Footer, Sider } = Layout;

export default class Homepage extends React.Component {
  state = {
    user: "",
  };
  componentDidMount = async () => {
    const user = getUser();
    this.setState({ user });
  };
  render() {
    if(this.state.user !== ""){

    
    const { user } = this.state;
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
            ©2021 Created by Team Explorers
          </Footer>
        </Layout>
      </Layout>
    );
  }
  else return (
    <div>
      Loading...
      </div>
  )
}
}
