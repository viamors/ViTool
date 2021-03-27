export function successToast(content) {
    uni.showToast({
        title: '操作成功'
    });
}

/* 日期&时间处理 */
// 当前日期
export function nowDate() {
	let nowDate = new Date();
	nowDate = formatDate(nowDate);
	return nowDate;
}
// 当前日期
export function nowTime() {
	let nowDate = new Date();
	let nowTime = formatTime(nowDate);
	return nowTime;
}

// 计算下一个纪念日
export function nextDate(date) {
	let dateArr = date.split('-');
	const year = dateArr[0]
	const month = dateArr[1]
	const day = dateArr[2]

	let nowDate = new Date();
	const nowYear = nowDate.getFullYear()
	const nowMonth = nowDate.getMonth() + 1
	const nowDay = nowDate.getDate()


	let nextDate = '';
	if (nowMonth < month) {
		nextDate = [nowYear, month, day].map(formatNumber).join('-');
	} else if (nowMonth == month) {
		if (nowDay > day) {
			nextDate = [nowYear + 1, month, day].map(formatNumber).join('-');
		} else {
			nextDate = [nowYear, month, day].map(formatNumber).join('-');
		}
	} else {
		nextDate = [nowYear + 1, month, day].map(formatNumber).join('-');
	}

	return nextDate;
}

// 格式日期
export function formatDate(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return [year, month, day].map(formatNumber).join('-')
}

// 格式时间
export function formatTime(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}


// 计算相差多少天
export function dateCount(startTime, endTime) {
	//日期格式化
	var start_date = new Date(startTime.replace(/-/g, "/"));
	var end_date = new Date(endTime.replace(/-/g, "/"));

	//转成毫秒数，两个日期相减
	var ms = end_date.getTime() - start_date.getTime();
	//转换成天数
	var day = parseInt(ms / (1000 * 60 * 60 * 24));
	return day;
}
