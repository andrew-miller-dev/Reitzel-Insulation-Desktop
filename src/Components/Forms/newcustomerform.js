import { Card, Col, Form, Input, Row, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";


const { Item } = Form;

export default function NewCustomerForm(props) {
    const sendInfo = (values) => {
        console.log(values);
    }


    return (
        <Form layout="vertical" onFinish={sendInfo}>
            <Card title="Add new customer">
                <Card title="Contact Info">
                    <Row>
                    <Col>
                    <Item
                    name="firstName">
                    <Input placeholder="First Name" />
                </Item>
                 </Col>
                 <Col>
                <Item
                name="lastName">
                    <Input placeholder="Last Name" />
                </Item>
                     </Col>
                 </Row>
                 <Row>
                     <Col>
                     <Item
                     name="email">
                         <Input placeholder="Email" type="email" />
                     </Item>
                     </Col>
                     <Col>
                     <Item
                     name="phone">
                         <Input placeholder="Phone Number" type="tel" />
                     </Item>
                     </Col>
                 </Row>
            </Card>
            <Card title="Addresses">
            <Form.List name="addresses">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 4 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'address']}
                >
                  <Input placeholder="Address"/>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'city']}
                >
                  <Input placeholder="City"/>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'postal']}
                >
                  <Input placeholder="Postal Code"/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add another address
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
            </Card>
            </Card>
        <Item>
            <Button type="primary" htmlType="submit">Test</Button>
        </Item>
        </Form> 
    )
}