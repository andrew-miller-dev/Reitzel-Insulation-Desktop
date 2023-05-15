import {
    ReloadOutlined
  } from "@ant-design/icons";
  import { useHistory } from "react-router-dom";
export default function Refresh(props) {
    let history = useHistory();
    return(
        <button onClick={()=>{window.location.reload(false)}}>
            <ReloadOutlined />
        </button>
    )
}