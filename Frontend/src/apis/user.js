import axios from 'axios';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';
import { BASE_URL } from '../util/constant'

export const fetchUserProfile = async () => {
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    const userProfile = {
      username: decodedToken.username || '',
      email: decodedToken.email || '',
      phoneNumber: decodedToken.phoneNumber || '',
      password: decodedToken.password || ''
    };
    return userProfile;
    }
}

export const sub2greenhouse = async (greenhouseID) => { 
  try {
    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const response = await axios.post(
      `${BASE_URL}/user/${decodedToken.sub}/true`, // Truyền userId và option=true vào URL
      { greenhouseID },                  // Body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};