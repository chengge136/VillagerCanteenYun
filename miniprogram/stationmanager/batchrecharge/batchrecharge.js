// stationmanager/batchBooking/batchBooking.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    color_a: '',
    color_b: '',
    color_c: '',
    color_d: '',
    color_e: '',
    userlists: [],
    selectedIds: [],
    count:0,
    submited: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var userlists = [];
    db.collection('wx_user').where(
      {
        usertype: _.eq('0')
      }
    ).get({
      success: function (res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          userlists.push({
            value: res.data[i]._id,
            name: res.data[i].name,
            balance: res.data[i].balance
          })
        }
        that.setData({
          userlists: userlists
        })
      }
    })

    db.collection('menu').where({
      name: _.eq('套餐饭'),
    }).get({
      success: function (res) {

        that.setData({
          price: res.data[0].price
        })
      }
    })

  },

  checkboxChange(e) {
    var that = this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    that.setData({
      selectedIds: e.detail.value,
      count: e.detail.value.length
    })

  },

  select_a() {
    console.log('10');
    this.setData(
      {
        amount: 10,
        color_a: '#1989FA',
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

  bacthrecharge() {

    var that = this;
    if (that.data.count > 0) {
      wx.showModal({
        title: '提示', 
        content: '确定给这 ' + that.data.count + ' 个账户充值 ' + that.data.amount+' 元？',
        success(res) {
          if (res.confirm) {
            that.setData({
              submited: true
            });
            
            // 1,批量增加余额
            app.modifybatchBalance(that.data.selectedIds, that.data.amount);

            wx.showLoading({
              title: '充值中',
            })

            setTimeout(function () {
              wx.hideLoading();
              wx.navigateBack({
               delta: 1
              })
            }, 3000)


          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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