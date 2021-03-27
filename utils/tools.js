
export function getApiUri(uri, ...param) {
	let baseUri = config.config.baseUri;
	if ('string' === typeof uri) {
		return rtrim(baseUri, '/') + '/' + trim(uri, '/');
	} else if ('object' === typeof uri) {
		// 获取uri中的所有未知参数
		let apiUri = uri.concat(),
			unknowParameter = [];
		for (let i in apiUri) {
			if (apiUri[i].indexOf('param_') !== -1) {
				unknowParameter[unknowParameter.length] = i;
			}
		}
		if (unknowParameter.length === param.length) {
			for (let j in unknowParameter) {
				apiUri[unknowParameter[j]] = param[j]
			}
			apiUri = apiUri.join('');
			return rtrim(baseUri, '/') + '/' + trim(apiUri, '/') + '/';
		}
		return false;
	}
	return false;
}

var trimChar = function(Str, char, type) {
	if (char) {
		if (type == 'left') {
			return Str.replace(new RegExp('^\\' + char + '+', 'g'), '');
		} else if (type == 'right') {
			return Str.replace(new RegExp('\\' + char + '+$', 'g'), '');
		}
		return Str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
	}
	return Str.replace(/^\s+|\s+$/g, '');
};
const ltrim = function(str, chars) {
	return trimChar(str, chars, 'left');
}
const rtrim = function(str, chars) {
	return trimChar(str, chars, 'right');
}
const trim = function(str, chars) {
	str = ltrim(str, chars);
	return rtrim(str, chars);
}

export function formatDate(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()
	return [year, month, day].map(formatNumber).join('-')
}


export function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 在二维数组中查询
 * @param {Object} searchArray 查询的数组
 * @param {Object} searchKey 查询的字段
 * @param {Object} searchVal 查询的值
 */
export function searchArr(searchArray, searchKey, searchVal) {
	const length = searchArray.length
	let resultIndex = -1;
	// let resultArr = [];
	if (searchKey && searchVal) {
		for (let i = 0; i < length; i++) {
			let arr = searchArray[i];
			if (searchVal == arr[searchKey]) {
				resultIndex = i;
				// resultArr = arr;
			}
		}
	}
	return resultIndex;
}

export {
	ltrim,
	rtrim,
	trim
}
