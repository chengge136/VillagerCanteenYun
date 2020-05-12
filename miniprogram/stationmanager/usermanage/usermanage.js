// stationmanager/usermanage/usermanage.js
const db = wx.cloud.database();
var app = getApp();
import Notify from '../../vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //注册
    name: '',
    sfzid:'',
    age:'',
    phone: '',
    managerph:'',
    address: '',
    notlike: '',
    disabled: false,
    userlists: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const _ = db.command;
    
    db.collection('wx_user').orderBy('ctime', 'desc').where(
      {
        usertype: _.eq('0')
      }
    ).get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].ctime = app.formatDate(new Date(res.data[i].ctime));
        }
        that.setData({
          userlists: res.data
        })
      }
    })

    var userDetail = wx.getStorageSync('userDetail');
    that.setData({
      address: userDetail.address,
      managerph: userDetail.phone
    })
  },
  register() {

    var that = this;
    const _ = db.command;
    if ((that.data.sfzid == '' && that.data.age == '') || that.data.name == '' || that.data.phone == '') {
      console.log('请填写完信息在提交！')
      Notify({ type: 'warning', duration: 3000, message: '信息不全\n请填写完再提交！' });
    }else {
      if ((that.data.sfzid.length != 18 && that.data.sfzid.length != 0) || (that.data.age.length > 2 && that.data.age.length != 0) || that.data.phone.length != 11){
        console.log('手机号、身份证、年龄格式不对')
        Notify({ type: 'warning', duration: 4000, message: '手机号、身份证、年龄中有格式不对\n身份证和年龄二选一必填\n身份证18位\n手机号11位' });
      }else{
      
        console.log(that.data.phone.substr(7, 4))
        //检查此账户是否存在
        var count = db.collection('wx_user').where({
          phone: _.eq(that.data.phone)
        }).count({
          success: function (res) {
            if (res.total > 0) {
              Notify({ type: 'warning', duration: 3000, message: '此手机号已注册，请直接登录\n忘记密码联系管理员' });
            } else {

              that.setData({
                disabled: true
              });
              that.insertUser();
            }
          }
        })    
      }  
    }
  },
  insertUser: function () {
    var that = this;
    that.setData({
      disabled: true
    });
    wx.cloud.callFunction({
      name: 'normalregister',
      data: {
        openid: '',
        nickName: '',
        avatarUrl: '',
        name: that.data.name,
        sfzid: that.data.sfzid,
        age: that.data.age,
        phone: that.data.phone,
        address: that.data.address,  
        notlike: that.data.notlike,
        password: that.data.phone.substr(7,4),
        active: true,
        balance: 0,
        insertbyph:that.data.managerph,
        usertype:'0',
        ctime: new Date().getTime()
      },
      complete: res => {
        console.log('insertUser result: ', res);
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: '../stationIndex/stationIndex'
              })
            }, 1000)
          }
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
  inputName: function (event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputSfzid: function (event) {
    var that = this;
    that.setData({
      sfzid: event.detail
    })
  },
  inputAge: function (event) {
    var that = this;
    that.setData({
      age: event.detail
    })
  },
  inputPhone: function (event) {
    var that = this;
    that.setData({
      phone: event.detail
    })
  },
  inputNotlike: function (event) {
    var that = this;
    that.setData({
      notlike: event.detail
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})