// users/myInfo/myInfo.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    address:'',
    avatarUrl:'',
    balance:0,
    age:'26',
    completecount:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const _ = db.command;
    var userDetail = wx.getStorageSync('userDetail');

    db.collection('order').where({
      phone: _.eq(userDetail.phone),
      isapproved: _.eq(true)
    }).count({
      success: function (res) {
        console.log('已经完成订单', res.total)
        that.setData({
          completecount: res.total
        })
      }
    })

    var userDetail = wx.getStorageSync('userDetail');
    console.log('myinfo_userdetial:',userDetail)
    that.setData({
      name: userDetail.name,
      address: userDetail.address,
      avatarUrl: userDetail.avatarUrl,
      balance: userDetail.balance
    })
  },
  recharge(){
    wx.navigateTo({ url: '../recharge/recharge' })
  },
  partner(){
    wx.navigateTo({ url: '../partner/partner' })
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