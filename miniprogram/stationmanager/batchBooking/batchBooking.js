// stationmanager/batchBooking/batchBooking.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlists: [],
    menulists: [],
    selectedIds:[],
    selectedmenu:[],
    noticenumber:0,
    menucount:0,
    count:0,
    total:0,
    isapproved:false,
    comment: '',
    orderprice:0,
    submited:false,
    addr:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const _ = db.command;
    var menulists = [];
    var userlists = [];
    var noticeusers = [];

    db.collection('menu').where(
      {
        type: _.eq(1)
      }
    ).get({
      success: function (res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length;i++){
          menulists.push({
            value: res.data[i].name,
            name: res.data[i].name,
            price: res.data[i].price,
            desc: res.data[i].desc
          })
          
        }
        that.setData({
          menulists: menulists
        })
      }
    })

    var userDetail = wx.getStorageSync('userDetail');
    that.setData({ addr: userDetail.address});
    db.collection('wx_user').where(
      {
        address: _.eq(userDetail.address),
        usertype: _.eq("0")
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
          if (res.data[i].balance<20){
            noticeusers.push(res.data[i].name);
          }
        }
        that.setData({
          userlists: userlists,
          noticenumber: noticeusers.length
        })
      }
    })

  },
  inputComment: function (e) {
    var that = this;
    console.log('comment', e.detail.value)
    that.setData({
      comment: e.detail.value
    })
  },
  checkboxChange(e) {
    var that=this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    that.setData({
      selectedIds: e.detail.value,
      count: e.detail.value.length
    })
    
  },
  selectmune(e) {
    var that = this;
    const _ = db.command;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    db.collection('menu').where({
      name: _.in(e.detail.value)
    })
      .field({
        price: true
      }).get({
      success: function (res) {
        var orderprice=0;
        for (var i = 0; i < res.data.length; i++) {
          orderprice += parseInt(res.data[i].price);

        }
        console.log('orderprice', orderprice);
        that.setData({
          orderprice: orderprice
        })
      }
    })

    that.setData({
      selectedmenu: e.detail.value,
      menucount: e.detail.value.length
    })

  },
  bacthbooking(){
   

    var that = this;
    const _ = db.command;
    var insufficientlists=[];
    var selectedusers = [];

    if (that.data.count > 0 && that.data.menucount>0){
      //判断勾选的每个人余额是否够的
      db.collection('wx_user')
        .where({
          _id: _.in(that.data.selectedIds)
        })
        .field({
          name: true,
          balance: true,
        }).get({
          success: function (res) {
            for (var i = 0; i < res.data.length;i++) {
              selectedusers.push(res.data[i].name);
              if (res.data[i].balance - that.data.orderprice<0){
                insufficientlists.push(res.data[i].name);
              }
            }

            if (insufficientlists.length > 0) {
              var slicelists = insufficientlists.slice(0, 3).toString();
              console.log(slicelists)
              Notify({ type: 'warning', duration:4000, message: slicelists +'\n的账户余额不足，请去除勾选'});
            }else{
              wx.showModal({
                title: '提示',
                content: '确定批量提交 [套餐订单]？',
                success(res) {
                  if (res.confirm) {
                    that.setData({
                      submited:true
                    });
                    var selecteduserstr = selectedusers.toString();
                    var selectedmenustr = that.data.selectedmenu.toString();
                    var total = that.data.count * that.data.orderprice

                    // 1,批量扣除余额
                    app.modifybatchBalance(that.data.selectedIds, -that.data.orderprice);
                    // 2,create batch order
                    app.createbatchOrder(that.data.count, total, selecteduserstr, that.data.comment, selectedmenustr);

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                   
                  }
                }
              })
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