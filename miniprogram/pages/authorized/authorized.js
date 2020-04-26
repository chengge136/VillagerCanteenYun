// pages/authorized/authorized.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var myopenid="";
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: function (res) {
        myopenid = res.result.openid;
        that.setData({
          openid: res.result.openid
        })
      }
    })

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']){
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.adduserinfoStorage(myopenid, res.userInfo.nickName, res.userInfo.avatarUrl);
            }
          });
        } 
      }
    });

  },

  //添加用户信息到缓存
  adduserinfoStorage(openid, nickName, avatarUrl){
    var that = this
    // var userInfo = wx.getStorageSync('userInfo')
    var userInfo=[];
    userInfo.push({
      openid: openid,
      nickName: nickName,
      avatarUrl: avatarUrl
    })
    //重新加入用户数据，存入缓存
    wx.setStorage({
      key: 'userInfo',
      data: userInfo[0],
        success: function (res) {
          setTimeout(function () {
              wx.redirectTo({
              url: '../logIn/logIn'
            })
          }, 1000);
        }
      })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log(e.detail.userInfo);    
      that.adduserinfoStorage(that.data.openid, e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl); 


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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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