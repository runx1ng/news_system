import React, { useEffect, useState } from 'react'
import { Table,Button, Modal, notification} from 'antd'
import axios from 'axios';
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined} from '@ant-design/icons'

const {confirm} = Modal;

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([]);

  const {username} = JSON.parse(localStorage.getItem('token'))
  
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res =>{
      const list = res.data;
      setdataSource(list)
    })
  }, [username])

  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'news title',
      dataIndex: 'title',
      render: (title, item) =>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'author',
      dataIndex: 'author'
    },
    {
      title: 'news category',
      dataIndex: 'category',
      render: (category) =>{
        return category.title;
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

          <Button shape='circle' icon={<EditOutlined/>} onClick={()=>{
            props.history.push(`/news-manage/update/${item.id}`)
          }}/>

          <Button type='primary' shape='circle' icon={<UploadOutlined/>} onClick={()=>handleCheck(item.id)}/>
        </div>
      }
    },
  ];

  const handleCheck = (id)=>{
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res =>{
        props.history.push('/audit-manage/list');

        notification.info({
          message: `announcement`,
          description:
            `you can move to audit list to check your news`,
          placement: 'bottomRight',
        });
    })
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

    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
    
  }


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>;
    </div>
  )
}
