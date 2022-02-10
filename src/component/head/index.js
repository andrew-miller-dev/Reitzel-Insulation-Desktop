import React, { useState, useEffect } from "react";
import { reqWeather } from "../../api/index";
import LinkButton from "../../pages/linkbutton";
import { Modal } from "antd";
import { removeMenu, removeUser } from "../../util/storage";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./index.css";
import { withRouter } from "react-router-dom";
const {format} = require('date-fns-tz');

function Head(props) {
  const [date, setCurrendate] = useState();
  const city = "Waterloo";
  const [icon, setIcon] = useState(`http://openweathermap.org/img/w/10d.png`);
  const [main, setMain] = useState();
  const timer = setInterval(() => {
    if (timer) clearInterval(timer);
    const date = new Date(Date.now());
    const dateFormatted = format(date,"MMMM do',' yyyy h':'mm':'ss");
    setCurrendate(dateFormatted);
  }, 1000);
  const getCancel = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to logout?",
      onOk: () => {
        removeUser();
        removeMenu();
        props.history.push("/login");
      },
    });
  };
  useEffect(() => {
    async function getWeather() {
      const weather = await reqWeather(city);
      if (weather) {
        const { icon, main } = weather.data.weather[0];
        setIcon(icon);
        setMain(main);
      }
    }
    getWeather();
  }, [city]);

  return (
    <>
      <div className="logo"></div>
      <div className="dashboard">
        <div className="upper">
          <div>
            <span>Welcome </span>
            <span className="welcome">{props.username}</span>

            <LinkButton onClick={getCancel}>Exit</LinkButton>
          </div>
        </div>
        <div className="lower">
          <div>
            <span>{city}</span>
            <span>{date}</span>
            <span>{main}</span>
            <span>
              <img alt="" src={`http://openweathermap.org/img/w/${icon}.png`} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
export default withRouter(Head);
