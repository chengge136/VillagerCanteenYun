// canteen/orderslist/orderslist.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lunchorders: [],
    dinnerorders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');

    db.collection('batchorders').where(
      {
        addr: _.eq(userDetail.address),
        tctype: _.eq(0)
      }
    ).orderBy('ctime', 'desc').get({
      success: function (res) {
        console.log(res.data)
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }

        that.setData({
          lunchorders: res.data
        })
      }
    })

    db.collection('batchorders').where(
      {
        addr: _.eq(userDetail.address),
        tctype: _.eq(1)
      }
    ).orderBy('ctime', 'desc').get({
      success: function (res) {
        console.log(res.data)
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }

        that.setData({
          dinnerorders: res.data
        })
      }
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