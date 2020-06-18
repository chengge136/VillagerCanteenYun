// stationmanager/batchBooking/batchBooking.js
import Notify from '../../vant/notify/notify';
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    userlists: [],
    batchpaylist:[],
    selectednamestr:'',
    submited: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userDetail = wx.getStorageSync('userDetail');
    const _ = db.command;
    var userlists = [];

    var myDate = new Date();


    db.collection('wx_user').where(
      {
        usertype: _.eq('0'),
        address: _.eq(userDetail.address)
      }
    ).get({
      success: function (res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          var sfzage = myDate.getFullYear() - res.data[i].sfzid.substring(6, 10) - 1;
          
          userlists.push({
            value: res.data[i]._id,
            name: res.data[i].name,
            age: sfzage,
            balance: res.data[i].balance,
            money:that.retMoney(sfzage),
            checked:false
          })
        }
        userlists.sort(that.sortprice); 
        console.log('userlists',userlists);
        that.setData({
          userlists: userlists
        })
      }
    })
    var userDetail = wx.getStorageSync('userDetail');
    db.collection('user_batchpay_record').orderBy('ctime','desc').where(
      {
        phone: _.eq(userDetail.phone)
      }
    ).get({
      success: function (res) {
        console.log(res.data);
        for (var index in res.data) {
          res.data[index].ctime = app.formatDate(new Date(res.data[index].ctime));
        }
        that.setData({
          batchpaylist: res.data
        })
      }
    })


  },
  bindKeyInput(e){ 
    var that=this;
    
    if(e.detail.value.length==0){
      e.detail.value='0';
    }
    var money=e.detail.value;
    var userlists=that.data.userlists;
    var name=e.currentTarget.dataset.name;
    // console.log(name +'的充值额度改成了'+money+'元');

    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].name==name){
        console.log('改变了第'+i+'个人的充值金额,'+name +'要充值'+money+'元');
        userlists[i].money=parseInt(money);
      }
    }
    that.setData({
      userlists: userlists
    });
    
    //更新支付总金额
    var amount=0;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        amount+=userlists[i].money
      }
    }
    that.setData({
      amount:amount
    });
  },
  retMoney(age){
    if(age>=80){
      return 150;
    }else if(age>=70){
      return 180;
    }else{
      return 300;
    }
  },
  checkAll(e){
    var that = this;
    //console.log('数组长度：',e.detail.value.length);
    var userlists=that.data.userlists;
    //全选
    if(e.detail.value.length==1){ 
      for (let i = 0;i < userlists.length; i++) {
        userlists[i].checked = true;
      }

      //去除全选
    }else{ 
      for (let i = 0;i < userlists.length; i++) {
        userlists[i].checked = false;
      }
    }

    //更新充值总金额和userlists
    var amount=0;
    for (let i = 0;i < userlists.length; i++) {
       if(userlists[i].checked){
        amount+=userlists[i].money
      }
    }

    that.setData({
      userlists: userlists,
      amount:amount
    });
  },
  checkboxChange(e) {
    var that = this;
    var userlists=that.data.userlists;
    console.log('checkbox携带value值为：', e.detail.value);
    var name=e.currentTarget.dataset.name;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].name==name){
        console.log('点击的是第'+i+'个，姓名是'+name);
        userlists[i].checked=!userlists[i].checked;
      }
    }
    that.setData({
      userlists: userlists
    });

    //更新支付总金额
    var amount=0;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        amount+=userlists[i].money
      }
    }
    that.setData({
      amount:amount
    });
  },

  sortprice(a,b){ 
    　　return a.age-b.age  
    　　},

 
  bacthrecharge() {

    var that = this;
    var userlists=that.data.userlists;
    var count=0;

    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        if(userlists[i].money==0){
          Notify({ type: 'warning', duration:4000, message: userlists[i].name+'的充值额度为0，请除去选中或者填入正确的金额' });
        }
        count+=1
      }
    }

    
    if(count>0){
      wx.showModal({
        title: '提示', 
        content: '确定给这 ' + count + ' 个账户充值 ' + that.data.amount+' 元？',
        success(res) {
          if (res.confirm) {
            that.setData({ //按钮变灰
              submited: true
            });
            
            // 1,微信扣费

            // 2,批量增加余额
            app.modifybatchBalance(that.data.userlists);
            // 3,生成充值记录
            app.createbatchpayrecord(that.data.userlists);

            wx.showLoading({
              title: '充值中',
            })

            setTimeout(function () {
              wx.hideLoading();
              that.onLoad();
              that.setData({
                submited: false
              });
              wx.showToast({
                title: '充值成功',
                icon: 'success',
                duration: 2000
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