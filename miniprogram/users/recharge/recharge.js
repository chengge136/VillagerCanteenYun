// users/recharge/recharge.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    arrivalamount: 0,
    color_a:'',
    color_b:'',
    color_c:'',
    color_d:'',
    color_e:'',
    name:'',
    phone:'',
    active: false,
    ret_50: 0,
    ret_100: 0,
    ret_200: 0,
    ret_500: 0,
    ret_1000: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userDetail = wx.getStorageSync('userDetail');
    this.setData({
      name: userDetail.name,
      phone: userDetail.phone
    })
    var that = this;
    const _ = db.command;

    db.collection('discount').where({
      type: _.eq(1)
    }).get().then(res => {
        console.log(res.data[0]);
        that.setData({
          ret_50: res.data[0].ret_50,
          ret_100: res.data[0].ret_100,
          ret_200: res.data[0].ret_200,
          ret_500: res.data[0].ret_500,
          ret_1000: res.data[0].ret_1000,
          active: res.data[0].active
        })
      })

  },
  select_a() {
    var that=this;
    console.log('50');
    that.setData(
      {
        amount:50,
        color_a:'#1989FA',
        color_b: '',
        color_c: '',
        color_d: '',
        color_e: ''
      }
    )
    if(that.data.active){
      that.setData({
        arrivalamount: 50+that.data.ret_50
      })
    }else{
      that.setData({
        arrivalamount: 50
      })
    }
  },
  select_b() {
    var that=this;
    console.log('100');
    this.setData(
      {
        amount:100,
        color_a: '',
        color_b: '#1989FA',
        color_c: '',
        color_d: '',
        color_e: ''
      }
    )
    if(that.data.active){
      that.setData({
        arrivalamount: 100+that.data.ret_100
      })
    }else{
      that.setData({
        arrivalamount: 100
      })
    }
  },
  select_c() {
    var that=this;
    console.log('200');
    this.setData(
      {
        amount:200,
        color_a: '',
        color_b: '',
        color_c: '#1989FA',
        color_d: '',
        color_e: ''
      }
    )
    if(that.data.active){
      that.setData({
        arrivalamount: 200+that.data.ret_200
      })
    }else{
      that.setData({
        arrivalamount: 200
      })
    }
  },
  select_d() {
    var that=this;
    console.log('500');
    this.setData(
      {
        amount:500,
        color_a: '',
        color_b: '',
        color_c: '',
        color_d: '#1989FA',
        color_e: ''
      }
    )
    if(that.data.active){
      that.setData({
        arrivalamount: 500+that.data.ret_500
      })
    }else{
      that.setData({
        arrivalamount: 500
      })
    }

  },
  select_e() {
    var that=this;
    console.log('1000');
    this.setData(
      {
        amount:1000,
        color_a: '',
        color_b: '',
        color_c: '',
        color_d: '',
        color_e: '#1989FA'
      }

    )
    if(that.data.active){
      that.setData({
        arrivalamount: 1000+that.data.ret_1000
      })
    }else{
      that.setData({
        arrivalamount: 1000
      })
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