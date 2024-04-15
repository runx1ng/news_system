import axios from "axios";
import { useState, useEffect } from "react";
import { notification } from "antd";
function usePublish(type){

    const { username } = JSON.parse(localStorage.getItem('token'));

    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
            // console.log(type);
        })
    }, [username, type])

    const handlePublish = (id)=>{
        setdataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            'publishState': 2,
            'publishTime': Date.now()
          }).then(res =>{      
              notification.info({
                message: `announcement`,
                description:
                  `you can move to publish management/published to check your news`,
                placement: 'bottomRight',
              });
          })
    }

    const handleSunset = (id)=>{
        setdataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            'publishState': 3,
            'publishTime': Date.now()
          }).then(res =>{      
              notification.info({
                message: `announcement`,
                description:
                  `you can move to publish management/published to check your news`,
                placement: 'bottomRight',
              });
          })
    }

    const handleDelete = (id)=>{
        setdataSource(dataSource.filter(item => item.id !== id));
        axios.delete(`/news/${id}`).then(res =>{      
            notification.info({
              message: `announcement`,
              description:
                `you already deleted your news`,
              placement: 'bottomRight',
            });
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish