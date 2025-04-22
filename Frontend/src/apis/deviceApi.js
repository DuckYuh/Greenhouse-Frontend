import axios from 'axios'
import { BASE_URL } from '../util/constant'

export const subscribeGreenhouseData = (greenhouseId, onMessage, onError) => {
    const eventSource = new EventSource(`${BASE_URL}/sse/data?greenhouse=${greenhouseId}`)

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
        const token = localStorage.getItem('token')
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
        const token = localStorage.getItem('token')
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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