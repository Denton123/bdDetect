import BaseService from './BaseService'

export default class PatientService extends BaseService {
  login (type, params) {
    return this.postApi('/patient/login/' + type, params)
  }

  wechatLogin(params) {
    return this.postApi('/patient/wx/login', params)
  }

  wechatBind(params) {
    return this.postApi("/patient/wx/bind", params)
  }

  forgetPwdValidate(params) {
    return this.postApi("/patient/forgetPwdValidate", params)
  }

  forgetPwdChange(params) {
    return this.postApi("/patient/changePwd", params)
  }

  projects(params) {
    return this.getApi("/v1/patient/projects", params)
  }

  getProjectItem(id, params) {
    return this.getApi('/v1/patient/getProjectItem/' + id, params)
  }

  logout(params) {
    return this.postApi('/v1/patient/logout', params)
  }

  orderList(params) {
    return this.getApi('/v1/patient/orderList', params)
  }

  getSmsCode(params) {
    return this.getApi('/patient/getSmsCode', params)
  }

  getCpSmsCode(params) {
    return this.getApi('/patient/cp/getSmsCode', params)
  }

  getBindSmsCode(pn) {
    return this.getApi('/patient/wx/getSmsCode?phoneNum=' + pn)
  }

  getOrderInfo(oid, params) {
    return this.getApi('/v1/patient/getOrderInfo/' + oid, params)
  }

  orderDetail(oid) {
    return this.getApi("/v1/patient/orderDetail/" + oid)
  }
  getAccountImages() {
    return this.getApi('/v1/patient/getAccountImages')
  }

  submitInovice(orderID, params) {
    return this.postApi(`/v1/patient/invoice/${orderID}`, params)
  }

  cancelOrder(orderID, params) {
    return this.postApi(`/v1/patient/cancelOrder/${orderID}`, params)
  }

  setAccountImage(params) {
    return this.postApi('/v1/patient/setAccountImage', params)
  }

  changeName(params) {
    return this.postApi('/v1/patient/changeName', params)
  }

  changePwd(params) {
    return this.postApi("/v1/patient/changePwd", params)
  }

  getReports(params) {
    return this.getApi("/v1/patient/getReports", params)
  }

  submitOrder(params) {
    return this.postApi('/v1/patient/submitOrder', params)
  }

  getReport(id) {
    return this.downloadApi('/v1/patient/reportDownload', {id: id}, '')
  }

  paperReport(params) {
    return this.postApi("/v1/patient/paperReport", params)
  }
}
