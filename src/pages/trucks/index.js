import React, {useState, useEffect} from 'react';
import {Button, Switch, Card, Table, Modal, message, Space} from 'antd';
import { getTrucks, changeAvailable, deleteTruckID } from '../../api/trucks';
import NewTruckForm from '../../Components/Forms/Truck_Forms/newtruckform';
import EditTruckForm from '../../Components/Forms/Truck_Forms/edittruckform';

export default function Trucks(props) {

    const [addShow, setAddShow] = useState(false);
    const [truckList, setTruckList] = useState([]);
    const [count, setCount] = useState(0);
    const [modalContent, setModalContent]= useState({});

    const title = (
        <Button
          onClick={() => {
            setAddShow(true);
            setModalContent(<NewTruckForm closeForm = {closeForm} />)
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
          title:"Truck Type",
          key:"truckType",
          dataIndex:"type"
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
            title:"Edit/Delete",
            render:(data) => (
              <div>
                <Space>
                  <Button onClick={()=>{ setAddShow(true);
                                          setModalContent(<EditTruckForm info={data} closeForm={closeForm}/>)}}>
                    Edit
                  </Button>
                   <Button 
                type="primary" danger
                onClick={() => {deleteTruck(data).then(() => {setCount(count + 1)})}}
                >X</Button>
                  
                </Space>
               
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
                    type:item.TruckType,
                    available:item.Available
                }
            ));
            let newList = table.sort((a,b) => {
              return a.number - b.number;
            })  
            setTruckList(newList);
        } 
        getData();
    }, [truckList.length, count]);

    const closeForm =() => {
      setAddShow(false); 
      setCount(count + 1);
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
        onOk() { return new Promise(async(resolve, reject) => {
          await deleteTruckID(data).then((item) => {
            resolve();
            setCount(count + 1);
          });
        })
          },
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
        title="Add/Edit Truck"
        visible={addShow}
        onCancel={closeForm}
        footer={false}
        destroyOnClose={true}>
          {modalContent}
        </Modal>
        
        </div>
    )
}