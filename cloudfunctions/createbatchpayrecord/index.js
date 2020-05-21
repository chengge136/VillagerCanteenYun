// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('user_batchpay_record').add({
    data: {
      user_ids: event.user_ids ,
      user_names: event.user_names,
      ctime: event.ctime,
      income: event.income,
      type: event.type,
      updatedby: event.updatedby,
      phone: event.phone,
      addr: event.addr,
      count: event.count
    }
  })
    .then(console.log)
    .catch(console.error)

}

