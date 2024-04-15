import React, { useEffect, useRef, useState } from 'react'
import {Button, Steps, Form, Input, Select, message, notification} from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const {Option} = Select;


export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  const [formInfo, setformInfo] = useState({});
  const [content, setContent] = useState('');

//   const User = JSON.parse(localStorage.getItem('token'))
  const newsForm = useRef(null);

  const handleNext =()=>{
    if(current === 0){
      newsForm.current.validateFields().then(res =>{
        setformInfo(res)
        setCurrent(current + 1);
      }).catch(error => {
        console.log(error);
      })
    }else{
      if(content === '' || content.trim() === '<p></p>'){
        message.error('news cotent cannot be empty')
      }else{
        setCurrent(current + 1);
      }
    }
  }

  const handlePrevious = ()=>{
    setCurrent(current - 1)
  }

  useEffect(()=>{
    axios.get('/categories').then(res =>{
      setCategoryList(res.data);
    })
  }, [])

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // setNewsInfo(res.data)

            let {title, categoryId, content} = res.data
            newsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [props.match.params.id])

  const handleSave = (auditState)=>{
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      'content': content,
      'auditState': auditState,
    }).then(res =>{
      props.history.push(auditState === 0? '/news-manage/draft' : '/audit-manage/list');

        notification.info({
          message: `announcement`,
          description:
            `you can move to ${auditState === 0 ? 'draft' : 'audit list'} to check your news`,
          placement: 'bottomRight',
        });
    })
  }


  return (
    <div>
      {/* <PageHeader className='site-page-header' title='Compose News' subTitle='subtitle'/> */}
      <h1>Update News</h1>
      <Button onClick={() => window.history.back()}>Back</Button>

      <Steps
        current={current}
        items={[
          {
            title: 'basic detail',
            description: 'new title, news category',
          },
          {
            title: 'news content',
            description: 'main body content',
            subTitle: 'Left 00:00:08',
          },
          {
            title: 'news publish',
            description: 'save draft / submit',
          },
        ]}
      />

      <div style={{marginTop: '50px'}}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="basic"
            ref={newsForm}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="news title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input news title',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="news category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Please select your news category',
                },
              ]}
            >
              <Select>
                {
                  categoryList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value)=>{
            setContent(value)
          }} content={content}></NewsEditor>
        </div>

        <div className={current === 2 ? '' : style.active}>

        </div>
      </div>

      <div style={{marginTop: "50px"}}>
        {
          current > 0 && <Button onClick={
            handlePrevious
          }>Back</Button>
        }
        {
          current < 2 && <Button type='primary' onClick={
            handleNext
          }>Next</Button>
        }

        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>{
              handleSave(0)
            }}>save drafts</Button>
            <Button danger onClick={()=>{
              handleSave(1)
            }} >submit</Button>
          </span>
        }
      </div>
    </div>
  )
}
