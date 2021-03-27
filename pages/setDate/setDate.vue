<template>
	<view class="rem-container">

		<view>
			<!-- 
			<gpp-date-picker @onCancel="onCancel" @onConfirm="onConfirm" :startDate="startDate" :endDate="endDate" :defaultValue="pickerDate">
			    {{pickerDate}}
			</gpp-date-picker>
			 -->
			 <view @click="cancleMasking" style="-webkit-flex: 1;flex: 1;"></view>
			<view style="justify-content: flex-end;">
				<calendar :startDate="startDate" :endDate="endDate" :limitFlag="limitFlag" :selectedDate="selectedDate" :showMonth="false"
				 :selected="selected" @change="calendarChange" />
			</view>
		</view>

		<view class="rem-down" v-if="0">
			<form @submit="formSubmit">

				<view class="rem-item-title ">
					<view class="cu-tag round  bg-blue light">标题</view>
				</view>
				<view class="cu-form-group rem-item">
					<view class="rem-item-detail">
						<input v-model="dataArr.title" placeholder="标题" placeholder-style="color:#dfdfdf;"></input>
					</view>
				</view>

				<view class="rem-item-title">
					<view class="cu-tag round  bg-blue light">日期</view>
				</view>
				<view class="cu-form-group rem-item">
					<view class="rem-item-detail">
						<view class="rem-date">
							<picker mode="date" :value="RemDate" start="1950-01-01" @change="dateChange">
								<view class="picker">
									{{RemDate}}
								</view>
							</picker>
						</view>
					</view>
				</view>

				<view class="rem-item-title ">
					<view class="cu-tag round  bg-blue light">备注</view>
				</view>
				<view class="cu-form-group rem-item">
					<view class="rem-item-detail">
						<textarea v-model="dataArr.remark" class="rem-item-textarea" placeholder="xxxxxx" placeholder-style="color:#dfdfdf;"></textarea>
					</view>
				</view>

				<view class="rem-item-btn">
					<button @tap="submit" class="cu-btn bg-blue round lg shadow">保存</button>
				</view>
				<view class="rem-item-btn">
					<button @tap="removeShow" class="cu-btn line-red round sm shadow">删除</button>
				</view>

			</form>
		</view>
	</view>
</template>

<script>
	var _self;
	const dateUtil = require('../../utils/date.js');
	const interaction = require('../../utils/interaction.js');
	import calendar from '@/components/heqifang-calendar/calendar.vue'

	export default {
		components: {
			calendar
		},
		data() {
			return {
				dataId: '',
				dataArr: {
					title: '',
					date: '',
					remark: ''
				},
				RemDate: '选择日期',


				// 日历插件
				showMonth: false, // 以月份为背景
				money: 6.00,
				isFlag: true,
				totalAmount: 0.00,
				startDate: '2020-04-05', // limitFlag == true 有效
				endDate: '2022-04-25', // limitFlag == true 有效
				/* 已选日期 */
				selectedDate: [],
				// 限定可选日期
				limitFlag: false,
				/* 可选日期 */
				selected: [{
						date: '2020-04-08',
						info: '出行',
						data: {
							custom: '自定义信息',
							name: '自定义消息头'
						}
					},
					{
						date: '2020-04-10',
						info: '充足',
						data: {
							custom: '自定义信息',
							name: '自定义消息头'
						}
					},
					{
						date: '2020-07-05',
						info: '充足',
						data: {
							custom: '自定义信息',
							name: '自定义消息头'
						}
					}
				]
			}
		},
		opCalendar() {
			this.isFlag = true;
		},
		cancleMasking() {
			this.isFlag = false;
		},
		
		onLoad(option) {
			_self = this;
			let dataId = option.dataId;
			if (dataId) {
				_self.dataId = dataId;
				// _self.getData(dataId);
			}
		},
		methods: {
			calendarChange(e) {
				console.log(e);
				// 当前选择时间
				let _date = e.fulldate;
				// 判断这个时间是否已选中
				let _index = this.selectedDate.indexOf(_date);
				console.log(_index);
				if(_index < 0){
					// this.selectedDate = [];
					this.selectedDate.push(_date);
				}else{
					this.selectedDate.splice(_index,1);
				}
				// 计算总金额
				let _totalAmount = this.selectedDate.length * this.money;
				// 设置总金额
				this.totalAmount = _totalAmount.toFixed(2);
				console.log(_totalAmount);
			},
			
			getData: function(id) {
				const db = wx.cloud.database()
				// 查询当前用户所有的 counters
				db.collection('dateRecord').where({
					_id: id
				}).get({
					success: res => {
						_self.dataArr = res.data[0];
						_self.RemDate = res.data[0].date;
						console.log('[数据库] [查询记录] 成功: ', res)
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
			dateChange: function(e) {
				_self.RemDate = e.detail.value;
				_self.dataArr.date = _self.RemDate;
			},
			submit: function() {
				//标题
				if (_self.dataArr.title == '' || _self.dataArr.title == undefined) {
					return interaction.errorModal('标题不能为空');
				}
				//日期
				if (_self.dataArr.date == '' || _self.dataArr.date == undefined) {
					return interaction.errorModal('日期不能为空');
				}

				//表单数据
				var formData = {};
				formData.dataId = _self.dataId;
				formData.title = _self.dataArr.title;
				formData.date = _self.dataArr.date;
				formData.remark = _self.dataArr.remark;

				let nowTime = dateUtil.nowTime();
				formData.createdAt = nowTime;
				formData.updatedAt = nowTime;

				_self.updateFunction(formData);
				console.log(formData);
			},
			updateFunction: function(data) {
				wx.cloud.callFunction({
					name: 'date_update',
					data: data,
					success: res => {
						wx.showToast({
							title: '调用成功',
						})
						uni.switchTab({
							url: '/pages/date/date'
						});

						console.error('[云函数]调用成功')
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '调用失败',
						})
						console.error('[云函数]调用失败：', err)
					}
				})
			},
			removeShow: function() {
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_self.onRemove();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			onRemove: function() {
				if (_self.dataId) {
					const db = wx.cloud.database()
					db.collection('dateRecord').doc(_self.dataId).remove({
						success: res => {
							wx.showToast({
								title: '删除成功',
							})
							uni.switchTab({
								url: '/pages/date/date'
							});
						},
						fail: err => {
							wx.showToast({
								icon: 'none',
								title: '删除失败',
							})
							console.error('[数据库] [删除记录] 失败：', err)
						}
					})
				} else {
					wx.showToast({
						title: '无记录可删，请见创建一个记录',
					})
				}
			},
		}
	}
</script>

<style>
	.rem-down {
		text-align: center;
		display: flex;
		flex-direction: column;
		margin-left: 40rpx;
		margin-right: 40rpx;
		color: #323233;
		font-size: 28rpx;
		margin-top: 50rpx;
	}

	.rem-item {
		min-height: 90rpx;
		width: 670rpx;
		background-color: #FFFFFF;
		box-shadow: 0 44rpx 120rpx 0 rgba(0, 0, 0, .09);
		border: 1rpx solid rgba(0, 0, 0, .1);
		border-radius: 8rpx;
		margin-bottom: 50rpx;
	}

	.rem-item-title {
		margin-bottom: 10rpx;
		text-align: left;
	}

	.rem-item-detail {
		width: 600rpx;
		text-align: left;
		font-size: 32rpx;
	}

	.rem-date {
		width: 200rpx;
	}

	.rem-item-textarea {
		width: 600rpx;
	}

	.rem-item-btn {
		text-align: center;
		margin-bottom: 20rpx;
	}
</style>
