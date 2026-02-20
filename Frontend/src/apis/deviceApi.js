import axios from 'axios'
import { BASE_URL } from '../util/constant'
import Cookies from 'js-cookie'
import {EventSourcePolyfill} from 'event-source-polyfill'
import { authorizedAxios } from '../util/axiosAuthen'

export const subscribeGreenhouseData = (greenhouseId, onMessage, onError) => {
    const token = Cookies.get('token')
    const eventSource = new EventSourcePolyfill(`${BASE_URL}/sse/data?greenhouse=${greenhouseId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
    )

    eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        onMessage(parsedData) // Gọi callback để cập nhật dữ liệu
    }

    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        eventSource.close()
        onError?.(error)
    }

    return eventSource // Trả về EventSource để có thể đóng kết nối khi cần
}

// Fetch devices from API
export const fetchDevices = async (pageNum, greenhouseId = 1) => {
    try {
        const token = Cookies.get('token')
        console.log(token)
        const response = await axios.get(`${BASE_URL}/devices/controllers`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
            greenhouseId,
            limit: 5,
            pageOffset: pageNum
            }
        })
      return response.data
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  };

export const fetchSensors = async (pageNum, greenhouseId = 1) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}/devices/sensors`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        greenhouseId,  // Bạn có thể truyền tham số tùy theo yêu cầu
        limit: 5,
        pageOffset: pageNum
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching sensors:', error)
  }
}

export const sendDataToDevice = async (deviceId, status, value, userId) => {
    try {
        const token = Cookies.get('token')
        const response = await axios.post(`${BASE_URL}/devices/data`, {
            deviceId,
            status,
            value,
            userId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        console.error('Error sending data to device:', error.response ? error.response.data : error.message)
    }
}

export const getSensorRecords = async(deviceId, pageOffset = 1, limit = 10) => {
    try {
        const token = Cookies.get('token')
        const response = await axios.get(`${BASE_URL}/devices/sensor-records/${deviceId}`, {  
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                pageOffset,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sensor records:', error);
    }
}

export const addController = async (controllerDto) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.post(`${BASE_URL}/devices/controllers`, controllerDto,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding controller:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addSensor = async (sensorDto) => {
    try {
        const token = Cookies.get('token');
        const response = await axios.post(`${BASE_URL}/devices/sensors`, sensorDto,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding sensor:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getListGreenHouseAPI = async (page, limit) => {
    const response = await authorizedAxios.get(`/greenhouse/details?pageOffset=${page}&limit=${limit}`)
    return response.data
  }
  
  export const deleteGreenHouseAPI = async (id) => {
    const response = await authorizedAxios.delete(`/greenhouse/${id}`)
    return response.data
  }
  
  export const updateGreenHouseAPI = async (id, data) => {
    const response = await authorizedAxios.patch(`/greenhouse/${id}`, data)
    return response.data
  }
  
  export const addGreenHouseAPI = async (data) => {
    const response = await authorizedAxios.post('/greenhouse', data)
    return response.data
  }
    
export const getListSensorAPI = async (greenhouseId, page, limit = 10) => {
    const response = await authorizedAxios.get(`/devices/sensors?greenhouseId=${greenhouseId}&pageOffset=${page}&limit=${limit}`)
    return response.data
    }

export const getListSchedulesAPI = async (greenhouseId, page, limit = 10) => {
    const response = await authorizedAxios.get(`/scheduler/${greenhouseId}?pageOffset=${page}&limit=${limit}`)
    return response.data
    }
    
    export const addScheduleAPI = async (data) => {
    const response = await authorizedAxios.post('/scheduler', data)
    return response.data
    }
    
    export const deleteScheduleAPI = async (id) => {
    const response = await authorizedAxios.delete(`/scheduler/${id}`)
    return response.data
    }
    
    export const updateScheduleAPI = async (id, data) => {
    const response = await authorizedAxios.patch(`/scheduler/${id}`, data)
    return response.data
    }
    
    export const getDetailScheduleAPI = async (id) => {
    const response = await authorizedAxios.get(`/scheduler/controller/${id}`)
    return response.data
    }