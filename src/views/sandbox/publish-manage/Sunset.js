import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';
import { Button } from 'antd';
export default function Sunset() {

  //2 === published
  const {dataSource, handleDelete} = usePublish(3)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>delete</Button>}></NewsPublish>
    </div>
  )
}
