import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, notification } from 'antd';

export default function Audit() {
  const [dataSource, setdataSource] = useState([]);
  const {roleId, username, region} = JSON.parse(localStorage.getItem('token'))



  useEffect(()=>{
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      const list = res.data;
      setdataSource(roleObj[roleId] === 'superadmin'? list : [...list.filter(item => item.author ===username), ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')])
    })
  }, [roleId, region, username])

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
      title: 'manage',
      render: (item) => {
        return <div>
          <Button type='primary' onClick={()=>handleAudit(item, 2, 1)}>Pass</Button>
          <Button danger onClick={()=>handleAudit(item, 3, 0)}>Reject</Button>
        </div>
      }
    },
  ];

  const handleAudit = (item, auditState, publishState)=>{
    setdataSource(dataSource.filter(data => data.id !== item.id));

    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res =>{
      notification.info({
        message: `announcement`,
        description:
          `you can move to audit list to check your news`,
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
