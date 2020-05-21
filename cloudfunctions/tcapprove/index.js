// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('batchorders').where({
    isapproved: _.eq(false)
  }).update({
    // data 传入需要局部更新的数据
    data: {
      isapproved: true,
      approvedid: event.approvedid
    }
  })
    .then(console.log)
    .catch(console.error)
}

