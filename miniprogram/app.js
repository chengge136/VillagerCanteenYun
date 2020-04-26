//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yxk-kappa-hlb24',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  // 更改账户余额,根据手机号查询更改账户余额
  test(openid,newblance) {

  },
  modifyBalance: function (newbalance) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log('modifyBalance - openid', userInfo.openid)
    console.log('modifyBalance - newbalance', newbalance)
    wx.cloud.callFunction({
      name: 'modifyBalance',
      data: {
        openid: userInfo.openid,
        newbalance: newbalance
      },
      complete: res => {
        console.log('update balance success: ', res);
      }
    })
  },
  createOrder: function (about, menus, comment, total){
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        username: userDetail.name,
        addr: userDetail.address,
        about: about,
        menus: menus,
        notlike: userDetail.notlike,
        comment: comment,
        phone: userDetail.phone,
        total: total,
        ctime: new Date().getTime(),
        isapproved:false,
        subtype:0
      },
      complete: res => {
        console.log('createOrder success: ', res);
        wx.redirectTo({
          url: '../userOrders/userOrders',
        })
      }
    })
  }
})
