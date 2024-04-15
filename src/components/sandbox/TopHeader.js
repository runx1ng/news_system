import React from 'react'
import { Layout, Button, theme, Dropdown, Avatar} from 'antd';
import {withRouter} from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import {connect} from 'react-redux'
const { Header} = Layout;




function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = ()=>{
    props.changeCollapsed()
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const {role:{roleName}, username} = JSON.parse(localStorage.getItem('token'));


  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          {roleName}
        </a>
      ),
    },
    {
      key: '2',
      danger: true,
      label: <p onClick={()=>{
        localStorage.removeItem('token');
        props.history.replace('/login')
      }}>exit</p>
    },
  ];

  return (
    <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={changeCollapsed}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <div style={{float: 'right'}}>
            <span>welcome back <span style={{color: '1890ff'}}>{username}</span></span>
            <Dropdown menu={{items}}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </div>
    </Header>
  )
}

/**
 * connect(
 * // mapStateToProps
 * // mapDispatchToProps
 * )(被包装的组件)
 */

const mapStateToProps = ({CollApsedReducer: {isCollapsed}})=>{
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))


