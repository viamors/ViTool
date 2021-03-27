// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
	// API 调用都保持和云函数当前所在环境一致
	env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
	console.log('修改接口调用')
	console.log(event)
	console.log(context)


	// 可执行其他自定义逻辑
	// console.log 的内容可以在云开发云函数调用日志查看

	// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
	const wxContext = cloud.getWXContext()

	var dataId = event.dataId
	var title = event.title
	var date = event.date
	var remark = event.remark
	var createdAt = event.createdAt
	var updatedAt = event.updatedAt

	try {
		if (dataId !== '') {

			return await db.collection('dateRecord').doc(dataId).update({
				data: {
					title: title,
					date: date,
					remark: remark,
					updatedAt: updatedAt
				}
			})

		} else {

			return await db.collection('dateRecord').add({
				data: {
					_openid: wxContext.OPENID,
					title: title,
					date: date,
					remark: remark,
					createdAt: createdAt,
					updatedAt: updatedAt
				}
			})
		}

	} catch (e) {
		console.log(e)
	}
}
