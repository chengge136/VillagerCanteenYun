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
    selectedIds:[],
    menulists:[],
    selectedmenu:[],
    noticenumber:0,
    menucount:0,
    count:0,
    total:0,
    isapproved:false,
    orderprice:0,
    submitlunch:false,
    submitdinner:false,
    addr:'',
    name:'',
    phone:'',
    lunchamount:0,
    dinneramount:0

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
    var myDate = new Date();
    that.setData({ addr: userDetail.address,
      name:userDetail.name,
      phone:userDetail.phone
    });
    db.collection('wx_user').where(
      {
        address: _.eq(userDetail.address),
        usertype: _.eq("0")
      }
    ).get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          var sfzage = myDate.getFullYear() - res.data[i].sfzid.substring(6, 10) - 1;

          userlists.push({
            value: res.data[i]._id,
            name: res.data[i].name,
            balance: res.data[i].balance,
            age:sfzage,
            lunchspend:that.lunchspend(sfzage),
            dinnerspend:that.dinnerspend(sfzage),
            checked:false
          })
          if (res.data[i].balance<20){
            noticeusers.push(res.data[i].name);
          }
        }
        userlists.sort(that.sortprice); 
        that.setData({
          userlists: userlists,
          noticenumber: noticeusers.length
        })
      }
    })

  },
  lunchspend(age){
    var lunchprice=this.data.menulists[0].price;
    if(age>=80){
      return lunchprice-2.5;
    }else if(age>=70){
      return lunchprice-2;
    }else{
      return lunchprice;
    }
  },
  dinnerspend(age){
    var dinnerprice=this.data.menulists[1].price;
    if(age>=80){
      return dinnerprice-2.5;
    }else if(age>=70){
      return dinnerprice-2;
    }else{
      return dinnerprice;
    }
  },
  sortprice(a,b){ 
    　return b.age-a.age  
    },

  checkbox(e) {
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
    var lunchamount=0;
    var dinneramount=0;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        lunchamount+=parseFloat(userlists[i].lunchspend);
        dinneramount+=parseFloat(userlists[i].dinnerspend);
     }
    }
    that.setData({
      lunchamount:lunchamount*100,
      dinneramount:dinneramount*100
    });
  },
  checkAll(e){
    console.log(e.detail.value);
    
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
    var lunchamount=0;
    var dinneramount=0;
    for (let i = 0;i < userlists.length; i++) {
       if(userlists[i].checked){
         console.log('lunchspend:',userlists[i].lunchspend);
        lunchamount+=parseFloat(userlists[i].lunchspend);
        dinneramount+=parseFloat(userlists[i].dinnerspend);
      }
    }
    console.log('lunchamount',lunchamount)

    that.setData({
      userlists: userlists,
      lunchamount:lunchamount*100,
      dinneramount:dinneramount*100

    });
  },
  submitlunch(){
    var that=this;
    //1,先判断是否有余额不够的人员被勾选中
    var userlists=that.data.userlists;
    var cannotpay=[];
    var selected=0;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        if(userlists[i].balance-userlists[i].lunchspend<0){
          cannotpay.push(userlists[i].name);          
        }
        selected+=1;
     }
    }
    if(selected>0){
     //如果有人余额不够
    if (cannotpay.length > 0) {
      var slicelists = cannotpay.slice(0, 3).toString();
      console.log(slicelists)
      Notify({ type: 'warning', duration:4000, message: slicelists +'\n的账户余额不足，请去除勾选'});
    }else{
      wx.showModal({
        title: '提示',
        content: '确定批量预订 [午餐套餐]？',
        success(res) {
          if (res.confirm) {
            that.setData({
              submitlunch:true
            });
             //2,批量扣款
            app.deletelunchBalance(userlists);
            //3,生成午餐批量订单
            app.createbatchOrder(userlists,0);

          } else if (res.cancel) {
            console.log('用户点击取消')
           
          }
        }
      })
    }
    }

  },
  submitdinner(){
    var that=this;
    //1,先判断是否有余额不够的人员被勾选中
    var userlists=that.data.userlists;
    var cannotpay=[];
    var selected=0;
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        if(userlists[i].balance-userlists[i].dinnerspend<0){
          cannotpay.push(userlists[i].name);
        }
        selected+=1;
     }
    }
    if(selected>0){
     //如果有人余额不够
    if (cannotpay.length > 0) {
      var slicelists = cannotpay.slice(0, 3).toString();
      console.log(slicelists)
      Notify({ type: 'warning', duration:4000, message: slicelists +'\n的账户余额不足，请去除勾选'});
    }else{
      wx.showModal({
        title: '提示',
        content: '确定批量预订 [晚餐套餐]？',
        success(res) {
          if (res.confirm) {
            that.setData({
              submitdinner:true
            });
             //2,批量扣款
            app.deletelunchBalance(userlists);
            //3,生成晚餐批量订单
            app.createbatchOrder(userlists,1);

          } else if (res.cancel) {
            console.log('用户点击取消')
           
          }
        }
      })
    }
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