import { Card, Col, Form, Input, Row } from "antd";

const { Item } = Form;

export default function NewCustomerForm(props) {
    return (
        <Form layout="vertical">
            <Card title="Add new customer">
                <Card title="Contact Info">
                    <Row>
                    <Col>
                    <Item
                    label="First Name">
                    <Input />
                </Item>
                 </Col>
                 <Col>
                <Item
                label="Last Name">
                    <Input />
                </Item>
                     </Col>
                 </Row>
                 <Row>
                     <Col>
                     <Item
                     lable="Email">
                         <Input type="email" />
                     </Item>
                     </Col>
                     <Col>
                     </Col>
                 </Row>
            </Card>
            <Card title="Addresses">
                <Item
                label="Address">
                    <Input />
                </Item>
            </Card>
            </Card>

        </Form> 
    )
}