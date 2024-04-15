import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios';
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'

const {confirm} = Modal;

export default function RightList() {

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res =>{
    const list = res.data;
    list.forEach(item => {
      if(item.children?.length === 0){
        item.children = null;
      }
    })
    setdataSource(list)
    })
  }, [])

  const [dataSource, setdataSource] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'rights title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'rights path',
      dataIndex: 'key',
      key: 'key',
      render:(key)=>{
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: 'manage',
      key: 'pagepermisson',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>{
            confirmMethod(item);
          }} />

          <Popover content={<div style={{textAlign: 'center'}}>
            <Switch checked={item.pagepermisson} onChange={()=>{
              switchMethod(item)
            }}></Switch>
          </div>} title="page configure" trigger={item.pagepermisson === undefined? '' : 'click'}>
            <Button type='primary' shape='circle' icon={<EditOutlined/>} disabled={item.pagepermisson === undefined}/>
          </Popover>
        </div>
      }
    },
  ];

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson === 1? 0 : 1;

    setdataSource([...dataSource])

    if(item.grade === 1){
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }else{
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
    // console.log(item);
  }

  //confirm pop-up
  const confirmMethod = (item)=>{
    confirm({
      title: 'Confirm to delete',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  //delete
  const deleteMethod = (item)=>{

    if(item.grade === 1){
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    }else{
      let list = dataSource.filter(data => data.id === item.rightId);
      list[0].children = list[0].children.filter(data => data.id !== item.id)

      setdataSource([...dataSource]);
      axios.delete(`/children/${item.id}`)
    }
    
  }


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}/>;
    </div>
  )
}
