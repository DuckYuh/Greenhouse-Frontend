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

export const sub2greenhouse = async (greenhouseIDs, subscribe) => { 
  try {
    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;

    const response = await axios.post(
      `${BASE_URL}/user/${userId}/${subscribe}`, // true = subscribe, false = unsubscribe
      { greenhouseID: greenhouseIDs },           // Body expects { greenhouseID: [1, 2, 3] }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
};