import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'

export default function AuditList(props) {

  const [dataSource, setdataSource] = useState([]);

  const {username} = JSON.parse(localStorage.getItem('token'))

  // in json sever, ne:not equal, lte: less than or equal
  useEffect(()=>{
    axios(`news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res =>{
      setdataSource(res.data);
    })
  }, [username])

  const columns = [
    {
      title: 'news title',
      dataIndex: 'title',
      render: (title, item) =>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'author',
      dataIndex: 'author',
    },
    {
      title: 'news category',
      dataIndex: 'category',
      render: (category) =>{
        return <div>{category.title}</div>
      }
    },
    {
      title: 'audit state',
      dataIndex: 'auditState',
      render: (auditState) =>{
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['draft', 'in progress', 'audited', 'fail']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: 'manage',
      key: 'pagepermisson',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={()=>handleRevert(item)} >Cancel</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={()=>handlePublish(item)}>publish</Button>
          }
          {
            item.auditState === 3 && <Button type='primary' onClick={()=>handleUpdate(item)}>update</Button>
          }
        </div>
      }
    },
  ];

  const handleRevert = (item)=>{
    setdataSource(dataSource.filter(data => data.id !== item.id));

    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: `announcement`,
        description:
          `you can move to draft box to check your news`,
        placement: 'bottomRight',
      });
    })
  }

  const handleUpdate = (item)=>{
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item)=>{
    axios.patch(`/news/${item.id}`, {
      'publishState': 2,
      'publishTime': Date.now()
    }).then(res =>{
      props.history.push('/publish-manage/published');

        notification.info({
          message: `announcement`,
          description:
            `you can move to publish management/published to check your news`,
          placement: 'bottomRight',
        });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>;
    </div>
  )
}
