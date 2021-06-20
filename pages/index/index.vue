<template>
	<view class="rem-container">

		<view class="rem-add">
			<view class="text-center">
				<button @tap="detailPage" class="cu-btn bg-blue round lg shadow">预约</button>
			</view>
		</view>


		<view class="">

			<view v-for="data in dataArr" :key="data._id">

				<view class="cu-timeline" :data-id="data._id" @tap="dateDetail">
					<view class="cu-item cuIcon-evaluate_fill">
						<view class="content">
							<view class="cu-capsule radius">
								<view class="cu-tag bg-blue">{{data.date}}</view>
								<view class="cu-tag line-blue">已有{{data.daysPass}}天</view>
								<view class="cu-tag line-red">还有{{data.daysWill}}天</view>
							</view>

							<view class="margin-top">
								{{data.title}}
								<!-- {{data.nextDate}} -->
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	const dateUtil = require('../../utils/date.js');
	export default {
		data() {
			return {
				isLogin: false,
				openid: '',
				dataArr: [],
			}
		},
		onLoad: function() {
			_self = this;

			var a = dateUtil.nowDate();
			console.log(a);

			if (getApp().globalData.openid) {
				_self.openid = getApp().globalData.openid;
				// _self.getData();
			} else {
				_self.getUserOpenid();
			}
		},
		
		onShow: function() {
			_self.getData();
		},
		methods: {
			onPullDownRefresh: () => {
				_self.getData();
				uni.stopPullDownRefresh();
			},
			
			getUserOpenid: function() {
				// 调用云函数
				wx.cloud.callFunction({
					name: 'login',
					data: {},
					success: res => {
						console.log('[云函数] [login] user openid: ', res.result.openid)
						getApp().globalData.openid = res.result.openid
						_self.openid = res.result.openid;

						_self.getData();
					},
					fail: err => {
						console.error('[云函数] [login] 调用失败', err)
					}
				})
			},
			getData: function() {
				// console.log(getApp().globalData)

				_self.onQuery();
			},

			onQuery: function() {

				const db = wx.cloud.database()
				// 查询当前用户所有的 counters
				db.collection('dateRecord').where({
					'_openid': _self.openid
				}).get({
					success: res => {
						// 处理时间
						for (var index in res.data) {
							// console.log(index)
							let iDate = res.data[index].date;
							let nowDate = dateUtil.nowDate();

							// let nextDate = '2021-01-01';
							let nextDate = dateUtil.nextDate(iDate);
							res.data[index].nextDate = nextDate;

							// 计算已经过去了多少天
							res.data[index].daysPass = dateUtil.dateCount(iDate, nowDate);
							// 计算还有多少天		
							res.data[index].daysWill = dateUtil.dateCount(nowDate, nextDate);
						}

						_self.dataArr = res.data;
						console.log('[数据库] [查询记录] 成功: ', res)
						console.log('查询的openid ', _self.openid)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						})
						console.error('[数据库] [查询记录] 失败：', err)
					}
				})
			},

			dateDetail: function(e) {
				let dataId = e.currentTarget.dataset.id;
				console.log(dataId);
				uni.navigateTo({
					url: '../dateInfo/dateInfo?dataId=' + dataId
				});
			},

			detailPage: function() {
				uni.navigateTo({
					url: '../dateInfo/dateInfo'
				});
			},

		}
	}
</script>

<style>
	.rem-mine {
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		text-align: center;
	}

	.rem-avatar image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
		border: 2rpx solid #ccc;
	}

	.rem-container {
		margin-top: 50rpx;
	}

	.rem-add {
		/* width: 100rpx; */
		/* padding-bottom: 20rpx; */
		/* border-bottom: thick dotted  #555555; */
	}
</style>
