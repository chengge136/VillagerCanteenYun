// manager/accountassign/accountassign.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    acivetab:'0',
    name: '',
    phone: '',
    address: '',
    disabled: false,
    station:[],
    canteen:[],
    finance:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    //获得站点管理员
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getwxusers',
      data: {
        usertype: "1"
      }
    }).then(res => {
      // console.log(res.result.data);
      for (var index in res.result.data) {
        res.result.data[index].ctime = app.formatDate(new Date(res.result.data[index].ctime));
      }

      that.setData({
        station: res.result.data
      })
    }).catch(err => {
      // handle error
    })

    //获得食堂管理员
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getwxusers',
      data: {
        usertype: "2"
      }
    }).then(res => {
      // console.log(res.result.data);
      for (var index in res.result.data) {
        res.result.data[index].ctime = app.formatDate(new Date(res.result.data[index].ctime));
      }
      that.setData({
        canteen: res.result.data
      })
    }).catch(err => {
      // handle error
    })

    //获得财务管理员
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getwxusers',
      data: {
        usertype: "3"
      }
    }).then(res => {
      // console.log(res.result.data);
      for (var index in res.result.data) {
        res.result.data[index].ctime = app.formatDate(new Date(res.result.data[index].ctime));
      }
      that.setData({
        finance: res.result.data
      })
    }).catch(err => {
      // handle error
    })
  },
  onClose(event) {
    const { position, instance } = event.detail;
    var name = event.currentTarget.dataset.name;
    var id = event.currentTarget.dataset.id;
    console.log(id);
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '提示',
          content: '要删除 ' + name+' ？',
          success(res) {
            if (res.confirm) {
              console.log('delete')
              instance.close();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
    }
  },
  register() {

    var that = this;
    const _ = db.command;
    if (that.data.name == '' || that.data.phone == '') {
      console.log('请填写完信息在提交！')
      Notify({ type: 'warning', duration: 3000, message: '信息不全\n请填写完再提交！' });
    } else if (that.data.phone.length != 11){
      Notify({ type: 'warning', duration: 3000, message: '手机号长度必须是11位！' });
    }else {
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
        address: that.data.address,
        phone: that.data.phone,
        notlike: '',
        password: that.data.phone.substr(7, 4),
        sfzid: '',
        age: 0,
        active: true,
        balance: 0,
        ctime: new Date().getTime(),
        insertbyph: '',
        usertype: that.data.radio
      },
      complete: res => {
        console.log('test result: ', res);
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            that.onLoad();
            that.setData({
              acivetab: that.data.radio
            })
          }
        })
      }
    })
  },


  onChange(event) {
    this.setData({
      radio: event.detail,
    });
    console.log("click");
  },
  inputName: function (event) {
    var that = this;
    that.setData({
      name: event.detail
    })
  },
  inputPhone: function (event) {
    var that = this;
    that.setData({
      phone: event.detail
    })
  },
  inputAddress: function (event) {
    var that = this;
    that.setData({
      address: event.detail
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