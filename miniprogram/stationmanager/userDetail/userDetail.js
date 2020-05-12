// stationmanager/userDetail/userDetail.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    notlike:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const _ = db.command;

    db.collection('wx_user').where(
      {
        _id: _.eq(options._id)
      }
    ).get({
      success: function (res) {
        res.data[0].ctime = app.formatDate(new Date(res.data[0].ctime));

        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          notlinke: res.data[0].notlinke,
        })
      }
    })
  },
  updateuser(){
    wx.showModal({
      title: '提示',
      content: '确定更新用户信息？',
      success(res) {
        if (res.confirm) {

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteuser(){
    wx.showModal({
      title: '提示',
      content: '确定删除此用户？',
      success(res) {
        if (res.confirm) {

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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