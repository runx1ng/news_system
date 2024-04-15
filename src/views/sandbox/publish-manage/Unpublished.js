import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';
import { Button } from 'antd';
export default function Unpublished() {

  //2 === unpublished
  const {dataSource, handlePublish} = usePublish(1)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handlePublish(id)}>publish</Button>} ></NewsPublish>
    </div>
  )
}
