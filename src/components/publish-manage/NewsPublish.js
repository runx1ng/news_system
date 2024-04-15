import React from 'react'
import { Table} from 'antd'


export default function NewsPublish(props) {
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
      render:(category)=>{
        return <div>{category.title}</div>
      }
    },
    {
      title: 'manage',
      key: 'pagepermisson',
      render: (item) => {
        return <div>
          {props.button(item.id)}
        </div>
      }
    },
  ];

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>;
    </div>
  )
}
