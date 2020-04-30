// pages/authorized/authorized.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    openid:'',
    no: '',
    pwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr = wx.getStorageSync('userInfo');
    console.log('login page of the nickName:',arr.nickName)
    this.setData({
      openid: arr.openid
    })
  },
  register(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  submit: function (e) {
     
    var that = this;
    that.setData({ disabled: true });
    const _ = db.command;
    db.collection('wx_user').where({
      openid: _.eq(that.data.openid)
    })
      .get().then(res => {
        console.log('balance', res.data[0].balance)

        if (res.data.length==0){
          wx.showToast({
            title: '账号不存在，请先注册',
            icon: 'none',
            duration: 2000
          })
          that.setData({ disabled: false });
        }else{
          //### 判断账户与密码 ###
          if (that.data.no == res.data[0].phone && that.data.pwd == res.data[0].password){
          // if (that.data.no == '123' && that.data.pwd == '123') {
            //### 把用户的注册信息存入缓存 ###
            var userDetail=[];
            userDetail.push({
              name: res.data[0].name,
              address: res.data[0].address,
              notlike: res.data[0].notlike,
              phone: res.data[0].phone,
              balance: res.data[0].balance,
              avatarUrl: res.data[0].avatarUrl
            }) 

            wx.setStorage({
              key: 'userDetail',
              data: userDetail[0],
              success: function (res) {
                var userDetail = wx.getStorageSync('userDetail');
                console.log('userDetail:', userDetail);
                console.log('name:', userDetail.name);

                wx.redirectTo({
                  url: '../../users/userIndex/userIndex'
                })
              }
            }) 




          } else if (that.data.no == '123' && that.data.pwd == '123'){
            wx.redirectTo({
              url: '../../canteen/canteenIndex/canteenIndex'
            })
          }
          else{
            wx.showToast({
              title: '账号密码不对',
              icon: 'none',
              duration: 2000
            })
            that.setData({ disabled: false });
          }
        }
        
      })


  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log(e.detail.userInfo);
      setTimeout(function () {
        //要延时执行的代码
        wx.redirectTo({
          url: '../logIn/logIn?nickName=' + e.detail.userInfo.nickName + '&avatarUrl=' + e.detail.userInfo.avatarUrl,
        })
      }, 1000); //延迟时间
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  noinput: function (e) {
    this.setData({ no: e.detail.value });
    this.setData({ noinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }

  },
  pwdinput: function (e) {
    this.setData({ pwd: e.detail.value });
    this.setData({ pwdinput: true });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({ disabled: false });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({ disabled: true });
    } else {
      this.setData({ disabled: false });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})