import { Form, Row, Col } from "antd";
import EstimateForm from "../EstimateForm";
import NewCustomerButton from "../Form_Buttons/newCustomerButton";

export default function NewEstimateForm(props) {
    const startDate = props.start;
    const endDate = props.end;
    const salesman = props.salesman;

return(
    <div>
<Row>
    <Col> 
        <Form>
        <NewCustomerButton />
        
        </Form>
    </Col>
    <Col>
        <EstimateForm close={props.close} start = {startDate} end={endDate}  salesman={salesman} />
    </Col>

</Row>
   
      
    </div>    )
}