import axios from 'axios';
import Cookies from 'js-cookie'

export const fetchUserProfile = async (userName, email, phoneNumber, password) => {
  const token = Cookies.get('token')
    try {
        const response = await axios.get('/api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error('Error fetching user profile:', error)
    }
}