import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd'
import moment from 'moment'
import axios from 'axios';


export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null);

    useEffect(()=>{
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res =>{
            setNewsInfo({
              ...res.data,
              view: res.data.view + 1
            })
        }).then(res => {
          axios.patch(`/news/${props.match.params.id}`, {
            view: res.view + 1
          })
        })
    },[props.match.params.id])

    const items = [
        {
          key: '1',
          label: 'author',
          children: newsInfo?.author,
        },
        {
          key: '2',
          label: 'publish time',
          children: newsInfo?.publishTime? moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss') : '-',
        },
        {
          key: '3',
          label: 'region',
          children: newsInfo?.region,
        },
        {
            key: '4',
            label: 'view count',
            children: newsInfo?.view,
        },
        {
            key: '5',
            label: 'likes',
            children: newsInfo?.star
        },
        {
            key: '6',
            label: 'comments',
            children: 0
        }
      ];
    
      const handleLike =()=>{
        setNewsInfo({
          ...newsInfo,
          star: newsInfo.star + 1
        })

        axios.patch(`/news/${props.match.params.id}`, {
          star: newsInfo.star + 1
        })
      }
  return (
    <div>
      {
        newsInfo && <div>
          <Button onClick={() => window.history.back()}>Back</Button>
          <Descriptions title={newsInfo?.title} items={items}/>
          <LikeOutlined onClick={()=>{
            handleLike()
          }} />
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
