import React, { useEffect } from 'react'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout, theme } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './NewsSandBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'

const {Content} = Layout;

export default function NewsSandBox() {
  NProgress.start();
  useEffect(()=>{
    NProgress.done();
  })
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto'
          }}
        >
        

          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>

    
  )
}
