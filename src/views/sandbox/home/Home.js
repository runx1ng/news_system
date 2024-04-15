import React, { useEffect, useRef, useState } from 'react'
import {Card, Col, Row, List, Avatar, Drawer} from 'antd'
import axios from 'axios'
import * as echarts from 'echarts'
import _ from 'lodash'

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Home() {

  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);

  const [open, setOpen] = useState(false);
  const [pieChart, setpieChart] = useState(null)

  const barRef = useRef();
  const pieRef = useRef();

  useEffect(()=>{
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res =>{
      setviewList(res.data);
    })
  }, [])

  useEffect(()=>{
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res =>{
      setstarList(res.data);
    })
  }, [])

  useEffect(()=>{

    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))

      setallList(res.data)
    })

    

    //destory
    return ()=>{
      window.onresize = null
    }
    
  }, [])

  const renderBarView = (obj)=>{
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'news category echart'
      },
      tooltip: {},
      legend: {
        data: ['amount']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '60'
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: 'amount',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };
    myChart.setOption(option);

    window.onresize = ()=>{
      myChart.resize();
    }
  }

  const renderPieView = (obj) => {

    var currentList = allList.filter(item => item.author === username);
    var groupObj = _.groupBy(currentList, item => item.category.title);

    var list = [];
    for(var i in groupObj){
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    var myChart;
    if(!pieChart){
      myChart = echarts.init(pieRef.current);
      setpieChart(myChart)
    }else{
      myChart = pieChart
    }

    var option;

    option = {
      title: {
        text: 'current user news category echart',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'publish amount',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const {username, region, role:{roleName}} = JSON.parse(localStorage.getItem('token'))

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Most views" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Most likes" bordered={true}>
          <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={()=>{
                setOpen(true);

                setTimeout(() => {
                  renderPieView()
                }, 0);
              }}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={
                <div>
                  <b>{region ? '' : 'Global'}</b>
                  <span style={{paddingLeft: '30px'}}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer width='500px' title="personal news category" placement="right" onClose={()=>{
        setOpen(false)
      }} open={open}>
        <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}>

        </div>
      </Drawer>

      <div ref={barRef} style={{width: '100%', height: '400px', marginTop: '30px'}}>

      </div>
    </div>
  )
}
