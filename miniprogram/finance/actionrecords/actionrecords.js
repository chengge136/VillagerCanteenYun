// finance/finance/finance.js
const db = wx.cloud.database();
import Notify from '../../vant/notify/notify';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    activedinner: '',
    financeorders:[],
    orders:[{"name":"lucas",age:11},{"name":"tom",age:11}],

    balancerecords:[],
    activeorders:'',
    activebalance:''
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;

    db.collection('order').where(
      {
        subtype: _.eq(2)
      }
    ).orderBy('ctime', 'desc').get({
      success: function (res) {
        for (var index in res.data) {
          res.data[index].approvedid = app.formatDate(new Date(res.data[index].ctime));
        }  
        that.setData({
          financeorders: res.data
        })
      }
    })


    db.collection('user_pay_record').where(
      {
        type: _.eq(1)
      }
    ).orderBy('ctime', 'desc').get({
      success: function (res) {
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        } 
        that.setData({
          balancerecords: res.data
        })
      }
    })
  },
  activeOrders(event) {
    this.setData({
      activeorders: event.detail,
    });
  },
  activeBalance(event) {
    this.setData({
      activebalance: event.detail,
    });
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