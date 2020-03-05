import axios from 'axios'
import auth from '../auth.js'
// const Host = '/api'
const Host = ''
// const Host = '/v1'
export default class BaseService {
  constructor() {
    this.Request = axios.create({
      withCredentials: true
    })
    // 拦截处理token不自动更新问题
    this.Request.interceptors.request.use(
      function (config) {
        // const token = localStorage.getItem('BD_JWT_Token')
        let role
        let flag = window.location.pathname
        if (flag.indexOf('credit') !== -1) {
          role = 'BDLS_DAS_CREDIT'
        } else if (flag.indexOf('finance') !== -1) {
          role = 'BDLS_DAS_FINANCE'
        } else if (flag.indexOf('lab') !== -1) {
          role = 'BDLS_DAS_LAB'
        } else if (flag.indexOf('sales') !== -1) {
          role = 'BDLS_DAS_SALES'
        } else if (flag.indexOf('sampler') !== -1) {
          role = 'BDLS_DAS_SAMPLE'
        }
        // if (window.location.href.indexOf('credit') !== -1) {
        //   role = localStorage.getItem('DETECT_CREDIT_ROLE')
        // } else if (window.location.href.indexOf('finance') !== -1) {
        //   role = localStorage.getItem('DETECT_FINANCE_ROLE')
        // } else if (window.location.href.indexOf('lab') !== -1) {
        //   role = localStorage.getItem('DETECT_LAB_ROLE')
        // } else if (window.location.href.indexOf('sales') !== -1) {
        //   role = localStorage.getItem('DETECT_SALES_ROLE')
        // } else if (window.location.href.indexOf('sampler') !== -1) {
        //   role = localStorage.getItem('DETECT_SAMPLER_ROLE')
        // }
        // const role = localStorage.getItem('BD_SESSION_ROLE')
        // config.headers.Authorization = token
        config.headers.UserRole = role
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    // 拦截response
    this.Request.interceptors.response.use(
      function (config) {
        if (config.data.msg == '请先登录') {
          auth.logout()
          let loginUrl = "";
          loginUrl =
            window.location.href.indexOf("dev") !== -1 ?
            "http://dev.work.bdlifescience.com" :
            window.location.href.indexOf("test") !== -1 ?
            "http://test.work.bdlifescience.com" :
            "http://work.bdlifescience.com";
          window.location.href = `${loginUrl}/login`
        }
        return config
      },
      function (config) {
        return config
      }
    )
  }

  throwReqError(resp) {
    const error = new Error(resp.statusText)
    error.resp = resp
    throw error
  }

  checkStatus(resp) {
    if ((resp.status >= 200) && (resp.status < 400)) {
      return resp.data
    }
    this.throwReqError(resp)
  }

  procReqError(err) {
    // console.log(err.toString())
    if (err.toString().indexOf('401') > -1) {
      // localStorage.removeItem(auth.jwt.token)
      auth.logout()
      return {
        ret: 1,
        msg: '请先登录',
      }
    } else if (err.toString().indexOf('400') > -1) {
      return {
        ret: 1,
        msg: '请求错误、稍后重试',
      }
    } else if (err.toString().indexOf('403') > -1) {
      return {
        ret: 1,
        msg: '没有权限',
      }
    } else if (err.toString().indexOf('404') > -1) {
      return {
        ret: 1,
        msg: '请求的页面不存在',
      }
    } else if (err.toString().indexOf('500') > -1) {
      return {
        ret: 1,
        msg: '服务器异常、稍后重试',
      }
    }
  }

  procRequest(req) {
    return req.then(this.checkStatus).catch(this.procReqError)
  }

  downloadApi(url, data, filename, host) {
    url = host + url
    return this.Request.post(url, data, {
      responseType: 'blob'
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      if (filename) {
        link.setAttribute('download', filename);
      }
      document.body.appendChild(link);
      link.click();
    });
  }

  getApi(url, data, host) {
    url = host + url
    return this.procRequest(this.Request.get(url, {
      params: data
    }))
  }

  postApi(url, data, host) {
    url = host + url
    return this.procRequest(this.Request.post(url, data))
  }

  putApi(url, data, host) {
    url = host + url
    return this.procRequest(this.Request.put(url, data))
  }

  deleteApi(url, host) {
    url = host + url
    return this.procRequest(this.Request.delete(url))
  }
}