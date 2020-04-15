// users/userIndex/UserIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    swiperList: ["../../images/a.jpg",
      "../../images/b.jpg",
      "../../images/c.jpg"
    ],
    //首页导航栏数据
    navList: ['点餐','购物车','订单','个人中心'],
    currentIndexNav:0,
    videosList:[
      "../../images/1.jpg",
      "../../images/2.jpg",
      "../../images/3.jpg",
      "../../images/1.jpg",
      "../../images/2.jpg",
      "../../images/3.jpg"
     
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击首页导航按钮
  activeNav(e) {
    console.log(e.target.dataset.index);
    this.setData(
      {
        currentIndexNav: e.target.dataset.index
      }
    )

    if (e.target.dataset.index==1){
      wx.navigateTo({ url: '../userCart/userCart' })
    } else if (e.target.dataset.index == 2){
      wx.navigateTo({ url: '../userOrders/userOrders' })
    } else if (e.target.dataset.index == 3) {
      wx.navigateTo({ url: '../myInfo/myInfo' })
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