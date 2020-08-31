// finance/finance/finance.js
const db = wx.cloud.database();
import Notify from '../../vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    name:'',
    balance:'',
    address:'',
    money:'',
    comment:'',
    usertype:'',
    tsbutton:false,
    czbutton:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail,
    });
  },
  inputMoney(e) {
    this.setData({
      money: e.detail,
    });
  },
  inputComment(e) {
    this.setData({
      comment: e.detail,
    });
  },
  onSearch() {
    let that = this;
    console.log('搜索' + that.data.phone);

    const _ = db.command;

    db.collection('wx_user').where(
      {
        phone: _.eq(that.data.phone)
      }
    ).get({
      success: function (res) {
        if( res.data.length>0){
          that.setData({
            name: res.data[0].name,
            address: res.data[0].address,
            balance:res.data[0].balance,
            usertype:res.data[0].usertype
          })
        }else{
          Notify({ type: 'warning', duration:3000, message: '手机号'+that.data.phone+'的用户不存在，请核实后搜索' });
          that.setData({
            name: '',
            address: ''
          })
        }
        
      }
    })
  },
  createtsOrder(){
    var that=this;
    if(!that.data.money=='' && !that.data.comment==''){
      wx.showModal({
        title: '提示', 
        content: '确定 ' + that.data.name + ' 堂食消费了 ' + that.data.money+' 元？',
        success(res) {
          if (res.confirm) {
            var balance=parseFloat(that.data.balance);
            var money=parseFloat(that.data.money);
            if(money>balance){
              Notify({ type: 'danger', duration:3000, message: that.data.name+'的账户余额不足，无法提交堂食订单' });
            }else{
              that.setData({ //按钮变灰
                tsbutton: true
              });
              
              // 1,生成堂食消费订单（需要用户登录后同意扣费）
              that.createOrder();

              // 2,扣款动作
              wx.cloud.callFunction({
                name: 'modifyBalance',
                data: {
                  phone: that.data.phone,
                  sum: -parseFloat(that.data.money)
                },
                complete: res => {
                  console.log('update balance success: ', res);
                  Notify({ type: 'success', duration:4000, message: '成功提交堂食消费订单,扣除'+that.data.name+'的账户余额'+that.data.money+'元' });

                  setTimeout(() => {
                    wx.redirectTo({
                      url: '../actionrecords/actionrecords',
                    });
                  }, 3050);
                  
                 

                }
              })

  
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  createOrder: function (){
    var that=this;
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        approvedid:'',
        username: that.data.name,
        addr: that.data.address,
        about: userDetail.name,
        comment: that.data.comment,
        phone: that.data.phone,
        total: that.data.money,
        ctime: new Date().getTime(),
        isapproved:true,
        subtype:2
      },
      complete: res => {
        console.log('createOrder success: ', res);
      }
    })
  },
  recharge(){
    var that=this;
    if(!that.data.money=='' && !that.data.comment==''){
      wx.showModal({
        title: '提示', 
        content: '确定给 ' + that.data.name + ' 的账户充值 ' + that.data.money+' 元？',
        success(res) {
          if (res.confirm) {
            that.setData({ //按钮变灰
              czbutton: true
            });           
            // 1,给用户账户充值
            console.log('modifyBalance - phone', that.data.phone)
            wx.cloud.callFunction({
              name: 'modifyBalance',
              data: {
                phone: that.data.phone,
                sum: parseFloat(that.data.money)
              },
              complete: res => {
                console.log('update balance success: ', res);
                that.setData({
                  balance:parseFloat(that.data.balance)+parseFloat(that.data.money)
                });
              }
            })
            //2,生成充值记录
            var userDetail = wx.getStorageSync('userDetail');
            console.log('that.data.money',that.data.money);
            wx.cloud.callFunction({
              name: 'payrecord',
              data: {
                name:that.data.name,
                phone: that.data.phone,
                income: that.data.money,
                comment:that.data.comment,
                updatedby:userDetail.name,
                type:1
              },
              complete: res => {
                console.log('create bay record of this user: ', res);
                Notify({ type: 'success', duration:4000, message: '成功为 ' + that.data.name + ' 的账户充值了 ' + that.data.money+' 元' });

                setTimeout(() => {
                  wx.redirectTo({
                    url: '../actionrecords/actionrecords',
                  });
                }, 3050);

              }
            })
              
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