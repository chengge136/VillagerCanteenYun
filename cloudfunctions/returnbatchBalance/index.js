// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('wx_user').where({
    name: _.in(event.usernames),
    address: _.eq(event.addr)

  }).update({
    // data 传入需要局部更新的数据
    data: {
      balance: _.inc(event.sum)
    }
  })
    .then(console.log)
    .catch(console.error)
}