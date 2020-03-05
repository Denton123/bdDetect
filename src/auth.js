const JWT_TOKEN = 'BD_JWT_Token'
const JWT_INFO = 'BD_JWT_INFO'


const SESSION_NAME = 'BD_SESSION_NAME'
// const SESSION_ICON = 'BD_SESSION_ICON'
const SESSION_GENDER = 'BD_SESSION_GENDER'
const SESSION_ROLE = 'BD_SESSION_ROLE'


const DETECTION_TEMP_INFO_BASE = 'BD_DETECTION_TEMP_INFO_BASE'
const DETECTION_TEMP_INFO_DETAIL = 'BD_DETECTION_TEMP_INFO_DETAIL'
const DETECTION_TEMP_INFO_PAY = 'BD_DETECTION_TEMP_INFO_PAY'

const DETECTION_TEMP_INFO0 = 'BD_DETECTION_TEMP_INFO0'
const DETECTION_TEMP_INFO1 = 'BD_DETECTION_TEMP_INFO1'
const DETECTION_TEMP_INFO2 = 'BD_DETECTION_TEMP_INFO2'
const DETECTION_TEMP_INFO3 = 'BD_DETECTION_TEMP_INFO3'
const DETECTION_TEMP_INFO4 = 'BD_DETECTION_TEMP_INFO4'

const IS_IOS = 'BD_MOBILE_IS_IOS'

// import { Base64 } from 'js-base64'; //解决中文decode乱码问题
import {getToken} from '@/cookie.js'

export default {
  jwt: {
    token: JWT_TOKEN,
    info: JWT_INFO
  },
  user: {
    username: SESSION_NAME,
    gender: SESSION_GENDER,
    authenticated: false,
  },
  setPhoneType(isIOS) {
    localStorage.setItem(IS_IOS, isIOS)
  },
  getPhoneType() {
    return localStorage.getItem(IS_IOS)
  },
  setLoginSession(data) {
    localStorage.setItem(this.user.username, data.username)
    localStorage.setItem(this.user.userIcon, data.userIcon)
    this.user.authenticated = true

  },
  getLoginSession() {
    return {
      username: localStorage.getItem(this.user.username),
      gender: localStorage.getItem(this.user.gender),
    }
  },
  logout() {
    localStorage.removeItem(this.user.username)
    localStorage.removeItem(this.user.gender)
    localStorage.removeItem(this.jwt.token)
    this.user.authenticated = false
  },
  isLogin () {
    // const data = this.getLoginSession()
    // if (data.username && data.userIcon) {
    //   this.user.authenticated = true
    // } else {
    //   this.user.user = false
    // }
    // return this.user.authenticated
    this.checkAuth()
    return this.user.authenticated
  },
  checkAuth () {
    // const data = this.getLoginSession()
    // if (data.username && data.userIcon) {
    //   this.user.authenticated = true
    // } else {
    //   this.user.user = false
    // }
    // return this.user.user
    // let token = localStorage.getItem(JWT_TOKEN)
    let token = getToken('_bdls_token_')
    if (token) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  },
  setLoginToken(data) {
    localStorage.setItem(JWT_TOKEN, data.token),
    localStorage.setItem(SESSION_NAME, data.username),
    localStorage.setItem(SESSION_GENDER, data.gender)
    // localStorage.setItem(SESSION_ROLE, data.role)
  },
  // checkAuth () {
  //   let jwt = localStorage.getItem(JWT_TOKEN)
  //   let info = JSON.parse(localStorage.getItem(JWT_INFO))
  //   if (jwt && info) {
  //     this.user.authenticated = true
  //   } else {
  //     this.user.authenticated = false
  //   }
  // },
  // parseJwt (token) {
  //   try {
  //     let t = token.split('.')[1]
  //     return JSON.parse(Base64.decode(t))
  //   } catch (e) {
  //     return null
  //   }
  // },
  // getAuthHeader () {
  //   return {
  //     'Authorization': 'Bearer ' + localStorage.getItem(JWT_TOKEN)
  //   }
  // },
  cacheDetectionTmp(step, data) {
    let cacheKey = `BD_DETECTION_TEMP_INFO${step}`
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    }
  },
  getDetectionTmp(step) {
    let cacheKey = `BD_DETECTION_TEMP_INFO${step}`
    return JSON.parse(localStorage.getItem(cacheKey))
  },
  clearDetectionTmp() {
    localStorage.removeItem(DETECTION_TEMP_INFO0)
    localStorage.removeItem(DETECTION_TEMP_INFO1)
    localStorage.removeItem(DETECTION_TEMP_INFO2)
    localStorage.removeItem(DETECTION_TEMP_INFO3)
    localStorage.removeItem(DETECTION_TEMP_INFO4)
  },
  cacheDetectionTemp(step, data) {
    let cacheKey = ""
    if (step === 1) {
      cacheKey = DETECTION_TEMP_INFO_BASE
    } else if (step === 2) {
      cacheKey = DETECTION_TEMP_INFO_DETAIL
    } else if (step === 3) {
      cacheKey = DETECTION_TEMP_INFO_PAY
    }
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify(data))
      return JSON.parse(localStorage.getItem(cacheKey))
    }
  },
  getDetectionTempInfo(step) {
    let cacheKey = ""
    if (step === 1) {
      cacheKey = DETECTION_TEMP_INFO_BASE
    } else if (step === 2) {
      cacheKey = DETECTION_TEMP_INFO_DETAIL
    } else if (step === 3) {
      cacheKey = DETECTION_TEMP_INFO_PAY
    }
    if (cacheKey) {
      return JSON.parse(localStorage.getItem(cacheKey))
    }
  },
  clearDetectionTempInfo() {
    localStorage.removeItem(DETECTION_TEMP_INFO_BASE)
    localStorage.removeItem(DETECTION_TEMP_INFO_DETAIL)
    localStorage.removeItem(DETECTION_TEMP_INFO_PAY)
  },
}
