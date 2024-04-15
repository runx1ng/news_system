import React, { forwardRef, useEffect, useState } from 'react'
import {Form, Input, Select} from 'antd'

const {Option} = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false);
    const [form] = Form.useForm();
    

    useEffect(()=>{
        setisDisabled(props.isUpdateDisabled);
    }, [props.isUpdateDisabled])

    const {roleId,region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }
    const checkRegionDisabled = (item)=>{
        if(props.isUpdate){
            if(roleObj[roleId] === 'superadmin'){
                return false;
            }else{
                return true
            }
        }else{
            if(roleObj[roleId] === 'superadmin'){
                return false;
            }else{
                return item.value !== region
            }
        }
    }

    const checkRoleDisabled = (item)=>{
        if(props.isUpdate){
            if(roleObj[roleId] === 'superadmin'){
                return false;
            }else{
                return true
            }
        }else{
            if(roleObj[roleId] === 'superadmin'){
                return false;
            }else{
                return roleObj[item.id] !== 'editor'
            }
        }
    }

  return (
      <Form
          ref={ref}  
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
              modifier: 'public',
          }}
      >
          <Form.Item
              name="username"
              label="username"
              rules={[
                  {
                      required: true,
                      message: 'Please input the title of collection!',
                  },
              ]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              name="password"
              label="password"
              rules={[
                  {
                      required: true,
                      message: 'Please input the title of collection!',
                  },
              ]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              name="region"
              label="region"
              rules={isDisabled? [] : [
                  {
                      required: true,
                      message: 'Please input the title of collection!',
                  },
              ]}
          >
              <Select disabled={isDisabled}>
                  {
                      props.regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)
                  }
              </Select>
          </Form.Item>
          <Form.Item
              name="roleId"
              label="role"
              rules={[
                {
                    required: true,
                    message: 'Please input the title of collection!',
                },
            ]}
          >
              <Select onChange={(value)=>{
                //if role is super admin, zone select will be disabled
                if(value === 1){
                    setisDisabled(true);
                    ref.current.setFieldsValue({
                        region: ""
                    })
                }else{
                    setisDisabled(false)
                }
              }}>
                  {
                      props.roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
                  }
              </Select>
          </Form.Item>
      </Form>
  )
})

export default UserForm