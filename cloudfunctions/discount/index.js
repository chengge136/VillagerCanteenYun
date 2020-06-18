// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('discount').where({
    type: _.eq(0)
  }).update({
    // data 传入需要局部更新的数据
    data: {
      cut_60: event.cut_60,
      cut_70: event.cut_70,
      cut_80: event.cut_80,
      deadline: event.deadline
    }
  })
    .then(console.log)
    .catch(console.error)
}

