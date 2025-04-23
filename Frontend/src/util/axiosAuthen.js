// create instance of axios
import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL } from './constant'
import Cookies from 'js-cookie'
import { refreshToken } from '../apis/auth'

export const authorizedAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 60 * 10, //10 min
  withCredentials: false
})

// đánh chặn khi gửi requested
authorizedAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// đánh chặn khi nhận response
authorizedAxios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // nếu token hết hạn thì xóa cookie và chuyển hướng về trang login
    const currentToken = Cookies.get('refreshToken')
    if (error.response?.status === 401 && currentToken) {
      try {
        if (error.config._retry) {
          window.location.href = '/login'
          return Promise.reject(error)
        }
        error.config._retry = true
        const response = await refreshToken(currentToken)
        const newRefreshToken = response.refresh_token
        const newAccessToken = response.access_token
        if (newAccessToken) {
          //cập nhật lại cookie
          Cookies.set('token', newAccessToken, {
            expires: 7,
            sameSite: 'Lax'
          })
          Cookies.set('refreshToken', newRefreshToken, {
            expires: 7,
            sameSite: 'Lax'
          })

          // Cập nhật token mới vào header và gọi lại request
          error.config.headers.Authorization = `Bearer ${newAccessToken}`
          return authorizedAxios(error.config)
        } else {
          Cookies.remove('token')
          Cookies.remove('refreshToken')
          window.location.href = '/login'
          throw new Error('Token khong hợp lệ vui lòng đăng nhập lại')
        }
      }
      catch {
        return Promise.reject(error)
      }
    }


    //bắt lỗi tập trung
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxios