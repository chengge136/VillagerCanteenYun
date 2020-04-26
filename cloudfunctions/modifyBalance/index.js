// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('wx_user').where({
    openid: _.eq(event.openid)
  }).update({
    // data 传入需要局部更新的数据
    data: {
      balance: event.newbalance
    }
  })
    .then(console.log)
    .catch(console.error)
}

