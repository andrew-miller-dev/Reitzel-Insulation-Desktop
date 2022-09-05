import { Form, Row, Col } from "antd";
import { useSelector } from "react-redux";
import EstimateForm from "../EstimateForm";
import NewCustomerButton from "../Form_Buttons/newCustomerButton";

export default function NewEstimateForm(props) {
    const info = useSelector(state => state.customerReducer.newEstimate);
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
        <EstimateForm start = {startDate} end={endDate}  salesman={salesman} />
    </Col>

</Row>
   
      
    </div>    )
}