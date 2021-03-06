// canteen/orderslist/orderslist.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    completedorders:[],
    completedtcorders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;

    db.collection('approvedlists').orderBy('approvedid', 'desc').where({
      type: _.eq(0),
    }).get({
      success: function (res) {
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }   
        that.setData({
          completedorders: res.data
        })
      }
    })

    db.collection('approvedlists').orderBy('approvedid', 'desc').where({
      type: _.eq(1),
    }).get({
      success: function (res) {
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }
        that.setData({
          completedtcorders: res.data
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