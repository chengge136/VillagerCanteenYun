// users/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    color_a:'',
    color_b:'',
    color_c:'',
    color_d:'',
    color_e:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  select_a() {
    console.log('10');
    this.setData(
      {
        amount: 10,
        color_a:'#1989FA',
        color_b: '',
        color_c: '',
        color_d: '',
        color_e: ''
      }
    )
  },
  select_b() {
    console.log('20');
    this.setData(
      {
        amount: 20,
        color_a: '',
        color_b: '#1989FA',
        color_c: '',
        color_d: '',
        color_e: ''
      }
    )
  },
  select_c() {
    console.log('50');
    this.setData(
      {
        amount: 50,
        color_a: '',
        color_b: '',
        color_c: '#1989FA',
        color_d: '',
        color_e: ''
      }
    )
  },
  select_d() {
    console.log('100');
    this.setData(
      {
        amount: 100,
        color_a: '',
        color_b: '',
        color_c: '',
        color_d: '#1989FA',
        color_e: ''
      }
    )

  },
  select_e() {
    console.log('200');
    this.setData(
      {
        amount: 200,
        color_a: '',
        color_b: '',
        color_c: '',
        color_d: '',
        color_e: '#1989FA'
      }
    )

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