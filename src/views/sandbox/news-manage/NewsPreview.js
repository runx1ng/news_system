import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd'
import moment from 'moment'
import axios from 'axios';


export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null);

    useEffect(()=>{
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res =>{
            setNewsInfo(res.data)
        })
    },[props.match.params.id])

    const auditList = ['unaudited', 'in progress', 'audited', 'fail'];
    const publishList = ['unpublished', 'to be published', 'published', 'offline'];

    const items = [
        {
          key: '1',
          label: 'author',
          children: newsInfo?.author,
        },
        {
          key: '2',
          label: 'create time',
          children: moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss')
        },
        {
          key: '3',
          label: 'publish time',
          children: newsInfo?.publishTime? moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss') : '-',
        },
        {
          key: '4',
          label: 'region',
          children: newsInfo?.region,
        },
        {
          key: '5',
          label: 'audit status',
          children: auditList[newsInfo?.auditState]
        },
        {
            key: '6',
            label: 'publish status',
            children: publishList[newsInfo?.publishState]
        },
        {
            key: '7',
            label: 'view count',
            children: newsInfo?.view,
        },
        {
            key: '8',
            label: 'likes',
            children: newsInfo?.star
        },
        {
            key: '9',
            label: 'comments',
            children: 0
        }
      ];
    
  return (
    <div>
        {
              newsInfo && <div>
                  <Button onClick={() => window.history.back()}>Back</Button>
                  <Descriptions title={newsInfo?.title} items={items} />
              </div>
        }

        <div dangerouslySetInnerHTML={{
            __html:newsInfo?.content
        }} style={{
            margin: '0 24px',
            border: '1px solid grey'
        }}>
        </div>
    </div>
  )
}
