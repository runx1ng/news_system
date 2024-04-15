import React, { useEffect, useState } from 'react'
import { Layout, Menu} from 'antd';
import './index.css'
import {withRouter} from'react-router-dom'
import axios from 'axios'
import {
  UserOutlined
} from '@ant-design/icons';
import {connect} from 'react-redux'
const { Sider} = Layout;

//模拟数组结构
// const menuList = [
//   {
//     key: '/home',
//     title: 'main page',
//     icon: <UserOutlined />
//   },
//   {
//     key: '/user-manage',
//     title: 'user manage',
//     icon: <UserOutlined />,
//     children:[
//       {
//         key: '/user-manage/list',
//         title: 'user list',
//         icon: <UserOutlined/>
//       }
//     ]
//   },
//   {
//     key: '/right-manage',
//     title: 'right manage',
//     icon: <UserOutlined />,
//     children:[
//       {
//         key: '/right-manage/role/list',
//         title: 'character list',
//         icon: <UserOutlined/>
//       },
//       {
//         key: '/right-manage/right/list',
//         title: 'right list',
//         icon: <UserOutlined/>
//       }
//     ]
//   }

// ];

const iconList = {
  '/home': <UserOutlined/>,
  '/user-manage': <UserOutlined/>,
  '/user-manage/list': <UserOutlined/>,
  '/right-manage': <UserOutlined/>,
  '/right-manage/role/list': <UserOutlined/>,
  '/right-manage/right/list': <UserOutlined/>,
}


function SideMenu(props) {

  const [menu, setMenu] = useState([])

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res =>{
      console.log(res.data);
      setMenu(res.data)
    })
  },[])

  const {role: {rights}} = JSON.parse(localStorage.getItem('token'))
  const checkpagepermisson = (item)=>{
    return item.pagepermisson && rights.includes(item.key);
  }

  const renderMenu = (menuList)=>{
    return menuList.map(item => {
      if(item.children?.length > 0 && checkpagepermisson(item)){
        return <Menu.SubMenu key={item.key} icon={iconList[item.key]} title={item.title} >
          {renderMenu(item.children)}
        </Menu.SubMenu>
      }

      return checkpagepermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })

  }

  const openKeys = ['/' + props.location.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
        <div className="demo-logo-vertical">Global News Release Management System</div>

        <div style={{flex: 1, overflow: 'auto'}}>
          <Menu theme='dark' mode='inline' selectedKeys={[props.location.pathname]} defaultOpenKeys={openKeys}>{renderMenu(menu)}</Menu>
        </div>
          


        
      </div>
      </Sider>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) =>({
  isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))
