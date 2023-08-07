import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { removeMenu, removeUser } from "../../util/storage";
import LinkButton from "../../pages/linkbutton";
import logo from '../../assets/logo.png';


export default function HeadSmall (props) {

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


    return(
        <div style={{height:'50px'}}>
        <div style={{float:'left'}}>
            <img src={logo} width={150}></img>
        </div>
        <div style={{borderBottomColor:'orange'}}></div>
        <div style={{float:'right'}}><LinkButton onClick={getCancel}>Exit</LinkButton></div>
        </div>
    )
}