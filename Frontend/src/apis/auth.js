import axios from 'axios'

import { BASE_URL } from '../util/constant'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8088',
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/signin', {
      email,
      password
    })

    return response.data
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || 'Login failed')
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      username,
      email,
      password
    })

    return response.data
  } catch {
    console.error('Signup failed:', error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

export const refreshToken = async (refreshToken) => {
  const data = {
    'refreshToken': refreshToken
  }
  const response = await axiosInstance.post('/auth/refreshToken', data)
  console.log('refresh ne:', response.data)
  return response.data
}