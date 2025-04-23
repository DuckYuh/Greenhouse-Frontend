import { authorizedAxios } from '../util/axiosAuthen'
import Cookies from 'js-cookie'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { BASE_URL } from '../util/constant'
import axios from 'axios'

export const fetchUnreadNotifications = (userId, onMessage, onError) => {
  // const response = await authorizedAxios.get(`/sse/notification?userId=${userId}&limit=${limit}`)
  // console.log('Fetched notifications:', response)
  // return response.data.filter(notification => !notification.isRead)
    const limit = 10
    const token = Cookies.get('token')
    const eventSource = new EventSourcePolyfill(`${BASE_URL}/sse/notification?userId=${userId}&limit=${limit}`,
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
    return eventSource
}

export const fetchIsRead = async (NID) => {
    const isRead = true
    const token = Cookies.get('token')
    try {
        const response = await axios.patch(`${BASE_URL}/notification/${NID}?isRead=${isRead}`,{},{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        return response.data
    } catch(error) {
        console.error('Error fetching' + error)
    } 
}