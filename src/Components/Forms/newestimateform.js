import { Form, Button, Row, Col } from "antd";
import { useSelector } from "react-redux";
import EstimateForm from "../EstimateForm";
import NewCustomerButton from "../Form_Buttons/newCustomerButton";

export default function NewEstimateForm(props) {
    const info = useSelector(state => state.customerReducer.newEstimate);

return(
    <div>
<Row>
    <Col> 
        <Form>
        <NewCustomerButton />
        <Button onClick={()=> {console.log(info)}}>
        Test
        </Button>
        </Form>
    </Col>
    <Col>
        <EstimateForm />
    </Col>

</Row>
   
      
    </div>    )
}