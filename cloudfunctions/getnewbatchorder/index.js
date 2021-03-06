// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  return await db.collection('batchorders').where({
    isapproved: event.isapproved,
    status: event.status
  }).get()
}
