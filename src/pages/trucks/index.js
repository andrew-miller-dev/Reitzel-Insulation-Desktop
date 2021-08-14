import React, {useState, useEffect} from 'react';
import {Button, Switch, Card, Table, Form, Modal, Input, message} from 'antd';
import { getTrucks, addTruck, changeAvailable } from '../../api/trucks';
const {Item} = Form;

export default function Trucks(props) {

    const [addShow, setAddShow] = useState(false);
    const [truckList, setTruckList] = useState([]);
    const [count, setCount] = useState(0);
    const [form] = Form.useForm();
    const title = (
        <Button
          onClick={() => {
            form.resetFields();
            setAddShow(true);
          }}
          type="primary"
        >
          Add new truck
        </Button>
      );

    const columns = [
        {
            title:"Truck #",
            key:"truckNum",
            dataIndex:'number'
        },
        {
            title:"Truck Info",
            key:"truckInfo",
            dataIndex:'info'
        },{
            title:"License Plate",
            key:"truckPlate",
            dataIndex:'plate'
        },
        {
            title:"Available",
            render:(data) => (            
              <div>
                <Switch 
                checked={data.available}
                onChange={() => {changeAvail(data)}}
                />
              </div>
                
            )
        },
        {
            title:"Delete Truck",
            render:(data) => (
              <div>
                <Button 
                type="primary" danger
                onClick={() => {deleteTruck(data)}}
                >X</Button>
                </div>

                
            )
        }

    ];
    useEffect(() => {
        const getData = async() => {
            let data = await getTrucks();
            let table = data.data.map((item) => (
                {
                    id:item.TruckID,
                    number:item.TruckNumber,
                    info:item.TruckInfo,
                    plate:item.LicensePlate,
                    available:item.Available
                }
            ));
            setTruckList(table);
        } 
        getData();
    }, [truckList.length]);

    const finishSubmit = async () => {
        const validResult = await form.validateFields();
        if (validResult.errorFields && validResult.errorFields.length > 0) return;
        const value = form.getFieldsValue();
  
        const result = await addTruck(value);
    if (result.data && result.data.affectedRows > 0) {
      message.success("Added new truck");
      setAddShow(false);
    } 
    }

    const changeAvail = async(data) => {
    let change = !data.available ? 1 : 0;
    let changeNum = change ? 1:0;
    data.available = changeNum;
    let result = await changeAvailable(data);
    if(result.status === 200) {
      message.success("Truck availability changed");
    }
    else{
      message.warning("Update failed")
    }
    setCount(count + 1);
    }
    const deleteTruck = async(data) => {
      Modal.confirm({
        title:"Are you sure you want to delete this truck?",
        onOk:{},
        cancelText:'No',
        okText:'Yes'
      });
    }
    return (
        <div>
            <Card title={title} bordered>
        <Table
          style={{ width: "80%", margin: "0 auto" }}
          rowKey="id"
          bordered
          dataSource={truckList}
          columns={columns}
          tableLayout="auto"
          pagination={{ pageSize: 10 }}
        ></Table>
        </Card>
        <Modal
        title="Add new truck"
        visible={addShow}
        onOk={finishSubmit}
        onCancel={() => {setAddShow(false)}}>
            <Form
            form={form}
            >
                <Item
                label="Truck Number"
              name="truckNumber"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
                </Item>
                <Item
                label="Truck Info"
              name="truckInfo"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
                </Item>
                <Item
                label="License Plate"
              name="truckPlate"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input />
                </Item>
        </Form>
        </Modal>
        
        </div>
    )
}