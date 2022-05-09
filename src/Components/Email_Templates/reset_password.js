import { Email, Item } from "react-html-email";
const header = "https://i.ibb.co/0snCVqq/header.png";


export default function ResetPasswordEmail(props) {
    return(
        <Email title="Your password reset">
            <Item>
                <img src={header}></img>
            </Item>
            <Item>
                <p>You are receiving this email because you requested a password reset.</p>
                    <br/>
                    <p>Your new password is:  </p>
                    <p>{props.newPassword}</p>
                    <br/>
                    <p>Please use this password to log in and you can change your password from your user profile</p>
            </Item>
        </Email>
    )
}