import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Switch} from 'antd'
import axios from 'axios';
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const {confirm} = Modal;



export default function UserList() {
  

  const [dataSource, setdataSource] = useState([]);
  const [isAddOpen, setisAddOpen] = useState(false);
  const [isUpdateOpen, setisUpdateOpen] = useState(false);
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const [current, setCurrent] = useState(null);

  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const addForm = useRef(null);
  const updateForm = useRef(null);

  const {roleId, username, region} = JSON.parse(localStorage.getItem('token'))
  
  useEffect(()=>{
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('/users?_expand=role').then(res =>{
    const list = res.data;
    setdataSource(roleObj[roleId] === 'superadmin'? list : [...list.filter(item => item.username ===username), ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')])
    })
  }, [roleId, region, username])

  useEffect(()=>{
    axios.get('/regions').then(res =>{
    const list = res.data;
    setregionList(list)
    })
  }, [])

  useEffect(()=>{
    axios.get('/roles').then(res =>{
    const list = res.data;
    setroleList(list)
    })
  }, [])


  const columns = [
    {
      title: 'Region',
      dataIndex: 'region',
      filters: [
        {
          text: 'Global',
          value: 'Global',
        },
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
      ],
      onFilter: (value, item) => {
        if (value === 'Global') {
          return item.region === ''
        }
        return item.region === value
      },

      render: (region) =>{
        return <b>{region === "" ? 'Global' : region}</b>
      }
    },
    {
      title: 'role name',
      dataIndex: 'role',
      render: (role)=>{
        return role.roleName
      }
    },
    {
      title: 'username',
      dataIndex: 'username',
    },
    {
      title: 'user status',
      dataIndex: 'roleState',
      // render可以传两个值，第二个是item
      render: (roleState, item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={()=> handleChange(item)}></Switch>
      }
    },
    {
      title: 'manage',
      key: 'pagepermisson',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>{
            confirmMethod(item);
          }} disabled={item.default}/>

          <Button type='primary' shape='circle' icon={<EditOutlined/>} disabled={item.default} onClick={()=> handleUpdate(item)}/>
        </div>
      }
    },
  ];

  const handleUpdate = async (item) =>{

    //不是说状态刚更新完，DOM就完事了 状态组件也完事了。
    //一般情况下，执行setisUpdateOpen之后会立刻执行updateForm,但由于DOM还没完事所以会报错。
    //这时候可以用setTimeout放到异步中，所以会变成同步触发的方案。先创建完妥妥当当的再执行下一步.
    //如果setTimeout不管用可以使用await
    await setisUpdateOpen(true);
    await updateForm.current.setFieldsValue(item);
    await setCurrent(item);

    if (item.roleId === 1) {
      //disable
      setisUpdateDisabled(true);
    } else {
      setisUpdateDisabled(false);
    }

    
  }

  const handleChange = (item)=>{
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);

    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    });
  }

  //confirm pop-up
  const confirmMethod = (item)=>{
    confirm({
      title: 'Confirm to delete',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  //delete
  const deleteMethod = (item)=>{

    setdataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`/users/${item.id}`);
  }

  const addFormOk = ()=>{
    addForm.current.validateFields().then(value => {
      setisAddOpen(false);

      //resetFields method is from Form component
      addForm.current.resetFields();

      //post to backend, generate id,then set up datasource, make updating and deleting more easier in the future.
      axios.post(`/users`, {
        ...value,
        'roleState': true,
        'default': false
      }).then(res =>{
        console.log(res.data);
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err);
    })
  }

  const updateFormOk = ()=>{
    updateForm.current.validateFields().then(value =>{
      setisUpdateDisabled(false);

      setdataSource(dataSource.map(item => {
        if(item.id === current.id){
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item;
      }))
      setisUpdateDisabled(!isUpdateDisabled);

      axios.patch(`/users/${current.id}`, value)
    })
  }


  return (
    <div>
      <Button type='primary' onClick={()=>{
        setisAddOpen(true);
      }}>Add RoleUser</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>
      <Modal
        open={isAddOpen}
        title="Add RoleUser"
        okText="Confirm"
        cancelText="Cancel"
        onCancel={()=>{
          setisAddOpen(false);
        }}
        onOk={() => addFormOk()}
      >

        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={isUpdateOpen}
        title="Update RoleUser"
        okText="Update"
        cancelText="Cancel"
        onCancel={()=>{
          setisUpdateOpen(false);
          setisUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={() => updateFormOk()}
      >

        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
    
  )
}
