import {
    DollarCircleOutlined,
    TeamOutlined,
    SnippetsOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    HomeOutlined,
    UserOutlined,
    KeyOutlined,
    ToolOutlined,
    SkinOutlined
  } from "@ant-design/icons";
  import React from "react";

export const home = {
    key: "/home",
    icon: <HomeOutlined />,
    path: "/home",
    content: "Home",
    isPublic: true,
  };

export const quotes = 
{
    key: "/quotes",
    icon: <DollarCircleOutlined />,
    path: "/quotes",
    content: "Quotes",
  }

export const orders = 
  {
    key: "/orders",
    icon: <SnippetsOutlined />,
    path: "/orders",
    content: "Orders",
  }
/*
export const invoices =
  {
    key: "/invoices",
    icon: <ShoppingCartOutlined />,
    path: "/invoices",
    content: "Invoices",
  }
*/
export const customers =
  {
    key: "/customers",
    icon: <TeamOutlined />,
    path: "/customers",
    content: "Customers",
  }

export const settings =  
    {
    key: "/settings",
    icon: <SettingOutlined />,
    content: "Settings",
    children: []
    }

export const users =
      {
        key: "/users",
        icon: <UserOutlined />,
        path: "/users",
        content: "Users",
      }

export const roles =
      {
        key: "/roles",
        icon: <KeyOutlined />,
        path: "/roles",
        content: "Roles",
      }

export const trucks = 
      {
        key: "/trucks",
        icon: <ToolOutlined />,
        path: "/trucks",
        content: "Trucks"
      }
export const profile = 
      {
        key: "/profile",
        icon: <SkinOutlined />,
        path: "/profile",
        content: "Profile"
}