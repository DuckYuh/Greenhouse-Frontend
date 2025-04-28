import axios from 'axios'
import { BASE_URL } from '../util/constant'
import Cookies from 'js-cookie'

export const fetchSchedules = async (page = 1) => {
    const limit = 100;
    const token = Cookies.get('token')
    const greenhouseId = localStorage.getItem('gid');
    try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:8088/scheduler/${greenhouseId}?pageOffset=${1}&limit=${limit}`,{
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    });
        return response;
    } catch (error) {
        console.error('Error fetching:', error)
      }
  };