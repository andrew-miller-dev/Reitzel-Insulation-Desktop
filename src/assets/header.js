import logo from "../../src/assets/logo.png";
const header = "https://i.ibb.co/wYqDcXp/logo.png";

export default function LogoHeader(){
    return(
    <div style={{display:"flex",justifyContent:"space-between"}}>
        <div style={{float:"left"}}>
            <img src={header} width="250" alt="Logo went oops" />
        </div>
        <div style={{float:"right"}}>
            <p style={{margin:"0px", fontSize:"10px"}}>134 Northfield Drive East</p>
            <p style={{margin:"0px", fontSize:"10px"}}>Waterloo, Ontario</p>
            <p style={{margin:"0px", fontSize:"10px"}}>N2J 4G8</p>
            <p style={{margin:"0px", fontSize:"10px"}}>519-886-6100</p>
            <p style={{margin:"0px", fontSize:"10px"}}>www.reitzel.ca</p>
            <p style={{margin:"0px", fontSize:"10px"}}>1-800-265-8869</p>
        </div>
    </div>
    )
}