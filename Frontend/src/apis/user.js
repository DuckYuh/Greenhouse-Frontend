import axios from 'axios';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';

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