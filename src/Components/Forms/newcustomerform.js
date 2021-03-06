import { Card, Col, Form, Input, Row, Button, Select, Checkbox, Switch, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { regions } from "../../util/storedArrays";
import { CheckForExisting, checkForMultipleBilling } from "../../config/checks";
import { addCustomer } from "../../api/neworder";
const {Option} = Select;
const { Item } = Form;

export default function NewCustomerForm(props) {
  const [form] = Form.useForm();

    const sendInfo = async(values) => {
      let billing = "";
        form.validateFields();
        console.log(values);
        if(values.addresses !== undefined){
           values.addresses.forEach((item) => {
          if(item.billing) billing = item;
        })
        }
       let newInfo = {
        FirstName : values.firstName,
        LastName:values.lastName,
        Phone:values.phone,
        Email:values.email,
        City:billing.city,
        PostalCode:billing.postal,
        Region:billing.region,
        BillingAddress:billing.address
       }
        const check = await CheckForExisting(newInfo);
        if(check.length > 0){
          message.warn("Customer already on file");
        }
        else{
        let customerInfo = await addCustomer(newInfo);
        var latestCustomer = customerInfo.data.insertId;
        if(values.addresses !== undefined){
          values.addresses.forEach((item) => {
            let addressInfo = {
              City:item.city,
              PostalCode:item.postal,
              Region:item.region,
              BillingAddress:item.address
            }
            var newAddress = await addAddress(latestCustomer, addressInfo);
          })
        }
        
        }
    }

    const options = regions.map((item, index) => (
      <Option key={index + 1}>{item}</Option>
    ));

    const checkBilling = () => {
      let array = form.getFieldValue('addresses');
      if(checkForMultipleBilling(array)){
        return Promise.reject(new Error('Only one billing address'))
      }
      else return Promise.resolve();
    }

    return (
        <Form form={form} layout="vertical" onFinish={sendInfo} preserve={false}>
            <Card title="Add new customer">
              <Row>
                <Col>
                <Card title="Contact Info">
                    <Row>
                    <Col>
                    <Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                       message: "Required",
                   },
                    ]}>
                    <Input placeholder="First Name" />
                </Item>
                 </Col>
                 <Col>
                <Item
                name="lastName"
                rules={[
                  {
                    required: true,
                   message: "Required",
               },
                ]}>
                    <Input placeholder="Last Name" />
                </Item>
                     </Col>
                 </Row>
                 <Row>
                     <Col>
                     <Item
                     name="email"
                     rules={[
                          {
                              type:"email",
                              message:"Not a valid email"
                          },
                          {
                               required: true,
                              message: "Required",
                          },
                          
                         
                      ]}>
                         <Input placeholder="Email"
                          />
                     </Item>
                     </Col>
                     <Col>
                     <Item
                     name="phone"
                     rules={[
                      {
                        required: true,
                       message: "Required",
                   },
                    ]}>
                         <Input placeholder="Phone Number" />
                     </Item>
                     </Col>
                 </Row>
            </Card>
                </Col>
                <Col>
                <Card title="Addresses">
              <Form.Item >              
            <Form.List name="addresses" >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div>

              
              <Row>
                <Col span={14}> <Form.Item
                  {...restField}
                  name={[name, 'address']}
                >
                  <Input placeholder="Address"/>
                </Form.Item>
                </Col>
               <Col>
               <Form.Item
                 {...restField}
                 name={[name, 'billing']}
                 valuePropName="checked"
                 rules={[{validator:checkBilling}]}
                 >
                   <Checkbox defaultValue={false}>Billing Address</Checkbox>
                 </Form.Item>
                </Col>
              </Row>
             <Row>
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
             </Row>
             <Row gutter={16}>
               <Col span={18}>
               <Form.Item
               {...restField}
               name={[name, 'region']}>
                 <Select placeholder="Select a region">{options}</Select>
               </Form.Item>
               </Col>
               
               <MinusCircleOutlined onClick={() => remove(name)} />
             </Row>
             
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add another address
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>
            </Card>
                </Col>
              </Row>
                
            
            </Card>
        <Item>
            <Button type="primary" htmlType="submit">Test</Button>
        </Item>
        </Form> 
    )
}