// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('discount').where({
    type: _.eq(1)
  }).update({
    // data 传入需要局部更新的数据
    data: {
      ret_50: event.ret_50,
      ret_100: event.ret_100,
      ret_200: event.ret_200,
      ret_500: event.ret_500,
      ret_1000: event.ret_1000,
      active: event.active
    }
  })
    .then(console.log)
    .catch(console.error)
}

