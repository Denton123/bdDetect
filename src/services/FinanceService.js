import BaseService from './BaseService'

export default class FinanceService extends BaseService {
  login (type, params) {
    return this.postApi('/login/' + type, params, '/reception/api/finance')
  }

  getSmsCode(params) {
    return this.getApi('/getSmsCode', params,'/reception/api/finance')
  }

  logout(params) {
    return this.postApi('/logout', params, '/reception/api/finance')
  }

  orderList(params) {
    return this.getApi('/orderList', params, '/reception/api/finance')
  }

  confirmInvoice(orderID) {
    return this.postApi(`/confirmInvoice/${orderID}`, {}, '/reception/api/finance')
  }

  inoviceInfo(orderID) {
    return this.getApi(`/invoiceInfo/${orderID}`, {},'/reception/api/finance')
  }

  getAccountImages() {
    return this.getApi('/getAccountImages', {},'/reception/api/finance')
  }

  setAccountImage(params) {
    return this.postApi('/setAccountImage', params, '/reception/api/finance')
  }

  changeName(params) {
    return this.postApi('/changeName', params, '/reception/api/finance')
  }

  changePwd(params) {
    return this.postApi("/changePwd", params, '/reception/api/finance')
  }
}
