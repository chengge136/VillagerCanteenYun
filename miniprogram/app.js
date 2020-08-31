//app.js
var app = getApp();
// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'yb445267387-oy2tz'
})
  
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yb445267387-oy2tz',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  // 更改账户余额,根据手机号查询更改账户余额
  test(openid,newblance) {

  },
  // 时间戳转为日期时间
  formatDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },
  getDate: function (now) {

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "-" + month + "-" + date;
  },
  getcurrentDate:function(now){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return Y + '年' + M + '月' + D + '日'  
  },
  modifyBalance: function (sum) {
    var userDetail = wx.getStorageSync('userDetail');
    console.log('modifyBalance - phone', userDetail.phone)
    console.log('本次增加的余额', sum)
    wx.cloud.callFunction({
      name: 'modifyBalance',
      data: {
        phone: userDetail.phone,
        sum: sum
      },
      complete: res => {
        console.log('update balance success: ', res);
      }
    })
  },

  modifybatchBalance: function (userlists) {
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        
        wx.cloud.callFunction({
          name: 'modifybatchBalance',
          data: {
            id: userlists[i].value,
            sum: userlists[i].money
          },
          complete: res => {
            console.log('update balance success: ', res);
          }
        })
      }
    }
  },
  deletelunchBalance: function (userlists) {
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        
        wx.cloud.callFunction({
          name: 'modifybatchBalance',
          data: {
            id: userlists[i].value,
            sum: -userlists[i].lunchspend
          },
          complete: res => {
            console.log('delete lunch balance success: ', res);
          }
        })
      }
    }
  },
  returnbatchBalance: function (addr, selecteduserstr, sum) {
    var usernames = selecteduserstr.split(",");
    wx.cloud.callFunction({
      name: 'returnbatchBalance',
      data: {
        addr: addr,
        usernames: usernames,
        sum: sum
      },
      complete: res => {
        console.log('returnbatchBalance success: ', res);
      }
    })
  },
  createbatchpayrecord: function (userlists) {
    var userDetail = wx.getStorageSync('userDetail');
    var income=0;
    var count=0;
    var paydetails='';
    for (let i = 0;i < userlists.length; i++) {
      if(userlists[i].checked){
        income+=parseInt(userlists[i].money);
        count+=1;
        paydetails+=userlists[i].name+'-'+userlists[i].money.toString()+'元;  '
      }
    }
    
    wx.cloud.callFunction({
      name: 'createbatchpayrecord',
      data: {
	      income: income,
	      ctime: new Date().getTime(),
	      updatedby: userDetail.name,
	      addr: userDetail.address,
	      phone: userDetail.phone,
	      count: count,
	      paydetails: paydetails
      },
      complete: res => {
        console.log('batch update balance success: ', res);
      }
    })
  },
  refund: function (_id, reason) {
    wx.cloud.callFunction({
      name: 'refund',
      data: {
        _id: _id,
        reason: reason
      },
      complete: res => {
        console.log('refund success: ', res);
        wx.navigateBack({
          delta: 1
        })

      }
    })
  },
  cancel: function (_id) {
    wx.cloud.callFunction({
      name: 'cancel',
      data: {
        _id: _id
      },
      complete: res => {
        console.log('cancel success: ', res);
        wx.showLoading({
          title: '取消订单',
        })

        setTimeout(function () {
          wx.hideLoading();
          wx.navigateBack({
            delta: 2
          })
        }, 2000)

      }
    })
  },
  cancelbatch: function (_id) {
    wx.cloud.callFunction({
      name: 'cancelbatch',
      data: {
        _id: _id
      },
      complete: res => {
        console.log('cancelbatch success: ', res);
        wx.showLoading({
          title: '取消订单',
        })

        setTimeout(function () {
          wx.hideLoading();
          wx.navigateBack({
            delta: 2
          })
        }, 2000)


      }
    })
  },
  createOrder: function (about, menus, comment, total){
    var userDetail = wx.getStorageSync('userDetail');
    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        approvedid:'',
        username: userDetail.name,
        addr: userDetail.address,
        about: about,
        menus: menus,
        notlike: userDetail.notlike,
        comment: comment,
        phone: userDetail.phone,
        total: total,
        ctime: new Date().getTime(),
        isapproved:false,
        subtype:0
      },
      complete: res => {
        console.log('createOrder success: ', res);
        wx.redirectTo({
          url: '../userOrders/userOrders',
        })
      }
    })
  },
  createbatchOrder: function (userlists,tctype) {
    var lunchsum=0;
    var dinnersum=0;
    var count=0;
    var selecteduserstr='';
    var userDetail = wx.getStorageSync('userDetail');
    if(tctype==0){//午饭
      for (let i = 0;i < userlists.length; i++) {
        if(userlists[i].checked){
          count+=1;
          lunchsum+=parseFloat(userlists[i].lunchspend);
          selecteduserstr+=userlists[i].name+'-'+userlists[i].lunchspend.toString()+'元;  '
       }
      }

      wx.cloud.callFunction({
        name: 'createbatchOrder',
        data: {
          approvedid: '',
          username: userDetail.name,
          phone: userDetail.phone,
          addr: userDetail.address,
          count: count,
          total: lunchsum,
          selecteduserstr: selecteduserstr,
          tctype: tctype,
          ctime: new Date().getTime(),
          isapproved: false,
        },
        complete: res => {
          console.log('createbatchOrder success: ', res);
          wx.redirectTo({
            url: '../orderslist/orderslist'
          })
        }
      })

    }else{ //晚饭
      for (let i = 0;i < userlists.length; i++) {
        if(userlists[i].checked){
          count+=1;
          dinnersum+=parseFloat(userlists[i].dinnerspend);
          selecteduserstr+=userlists[i].name+'-'+userlists[i].dinnerspend.toString()+'元;  '
       }
      }

      wx.cloud.callFunction({
        name: 'createbatchOrder',
        data: {
          approvedid: '',
          username: userDetail.name,
          phone: userDetail.phone,
          addr: userDetail.address,
          count: count,
          total: dinnersum,
          selecteduserstr: selecteduserstr,
          tctype: tctype,
          ctime: new Date().getTime(),
          isapproved: false,
        },
        complete: res => {
          console.log('createbatchOrder success: ', res);
          wx.redirectTo({
            url: '../orderslist/orderslist'
          })
        }
      })
    }
   
  }
})
