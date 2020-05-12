// canteen/canteenIndex/canteenIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');
    that.setData({
      address: userDetail.address
    });
    db.collection('menu').get({
      success: function (res) {
        var menulists = [];
        for (var i = 0; i < res.data.length; i++) {
          menulists.push({
            name: res.data[i].name,
          })
        }
        wx.setStorage({
          key: 'menus',
          data: menulists,
          success: function (res) {
            console.log('setStorage of menus: ', menulists.length)
          }
        })

      }
    })


  },
  batchcreateorders() {
    wx.navigateTo({
      url: '../batchBooking/batchBooking',
    })
  },
  queryorders() {
    wx.navigateTo({
      url: '../orderslist/orderslist',
    })
  },
  bacthrecharge() {
    wx.navigateTo({
      url: '../batchrecharge/batchrecharge',
    })
  },
  usersmanage() {
    wx.navigateTo({
      url: '../usermanage/usermanage',
    })
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