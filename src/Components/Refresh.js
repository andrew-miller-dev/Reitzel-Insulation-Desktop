import {
    ReloadOutlined
  } from "@ant-design/icons";

export default function Refresh(props) {
    return(
        <button onClick={()=>{window.location.reload(false)}}>
            <ReloadOutlined />
        </button>
    )
}