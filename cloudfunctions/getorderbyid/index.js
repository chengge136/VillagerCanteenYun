// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  if (event.type == 0){
    return await db.collection('order').where({
      approvedid: event.approvedid
    }).get();
  } else if (event.type == 1){
    return await db.collection('batchorders').where({
      approvedid: event.approvedid
    }).get();
  }
 
}
