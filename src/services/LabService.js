import BaseService from './BaseService'

export default class LabService extends BaseService {
  login(type, params) {
    return this.postApi('/lab/login/' + type, params)
  }

  getSmsCode(params) {
    return this.getApi('/lab/getSmsCode', params)
  }

  logout(params) {
    return this.postApi('/v1/lab/logout', params)
  }

  deleteImg(params) {
    return this.deleteApi(`/upload/delete/${params.id}/${params.uid}`, '/reception/api/lab')
  }

  options(params) {
    return this.getApi('/options', params, '/reception/api/lab')
  }

  orderDetail(oid) {
    return this.getApi("/orderDetail/" + oid, {}, '/reception/api/lab')
  }

  orderList(params) {
    return this.getApi('/orderList', params, '/reception/api/lab')
  }

  orderAccept(oid, type) {
    return this.postApi(`/orderAccept/${oid}/${type}`, {}, '/reception/api/lab')
  }

  getAccountImages() {
    return this.getApi('/getAccountImages', {}, '/reception/api/lab')
  }

  setAccountImage(params) {
    return this.postApi('/setAccountImage', params, '/reception/api/lab')
  }

  changeName(params) {
    return this.postApi('/changeName', params, '/reception/api/lab')
  }

  changePwd(params) {
    return this.postApi("/changePwd", params, '/reception/api/lab')
  }

  submitOrder(orderID, params) {
    return this.postApi(`/submitOrder/${orderID}`, params, '/reception/api/lab')
  }

  downloadExcel(params, filename) {
    return this.downloadApi(`/download`, params, filename, '/reception/api/lab')
  }
  
  reSampling(orderID, params) {
    return this.postApi(`/reSampling/${orderID}`, params, '/reception/api/lab')
  }
}