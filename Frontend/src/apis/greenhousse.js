import axios from 'axios'
import { BASE_URL } from '../util/constant'
import Cookies from 'js-cookie'

export const fetchGreenhouses = async () => {
    const token = Cookies.get('token')
    try {
        const response = await axios.get(`${BASE_URL}/greenhouse/names`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        return response
    } catch (error) {
        console.error('Error fetching greenhouses:', error)
    }
}