import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
const {confirm} = Modal;

export default function RoleList() {

  const [dataSource, setdataSource] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const [isModalOpen, setModalOpen]= useState(false);
  const columns = [
    {
      //如果不写key值有可能会报错，除非你的db里的数据有写key属性跟值。可以在table标签中使用rowKey指定别的属性当做key值解决
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: 'role name',
      dataIndex: 'roleName',

    },
    {
      title: 'manage',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>{
            confirmMethod(item);
          }} />
          <Button type='primary' shape='circle' icon={<EditOutlined/>} onClick={()=>{
            setModalOpen(true);
            setcurrentRights(item.rights);
            setcurrentId(item.id)
          }}/>
        </div>
      }
    },
  ];

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
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    
  }
  
  useEffect(()=>{
    axios.get('/roles').then(res=>{
      setdataSource(res.data);
    })
  }, [])

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      setrightList(res.data);
    })
  }, [])

  const handleOk = ()=>{
    setModalOpen(false);
    setdataSource(dataSource.map(item=>{
      if(item.id === currentId){
        return {
          ...item,
          rights: currentRights
        }
      }
      return item;
    }))

    //patch
    axios.patch(`/roles/${currentId}`,{
      rights: currentRights
    })
  }

  const handleCancel = ()=>{
    setModalOpen(false);
  }

  const onCheck = (checkKeys)=>{
    // console.log(checkKeys);
    setcurrentRights(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
      <Modal title="rights manage" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree checkable checkedKeys={currentRights} onCheck={onCheck} checkStrictly={true} treeData={rightList}/>
      </Modal>
    </div>
  )
}
