<template>
	<view>
		<!-- 
		<cu-custom bgColor="bg-gradual-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content" class="text-bold">个人信息</block>
		</cu-custom>
		 -->
		<form @submit="formSubmit">
			<view>
				<view class="cu-form-group margin-top rem-user-avatar">
					<view class="title">头像</view>
					<view class="cu-avatar round lg bg-gray rem-user-avatar-img" :style="{backgroundImage:'url('+avatarUrl+')'}"></view>
					<view class="rem-input-icon"></view>
				</view>

				<view class="cu-form-group rem-user-item">
					<view class="title">名字</view>
					<input placeholder="张XX" placeholder-style="color:#dfdfdf;" name="username" :value="username"></input>
					<!-- <view class="rem-input-icon cuIcon-right"></view> -->
				</view>
				<view class="cu-form-group  rem-user-item">
					<view class="title">性别</view>
					<picker @change="sexPickerChange" :value="sexIndex" :range="sexPicker" range-key="title">
						<view class="picker">{{sexTitle}}</view>
					</picker>
				</view>
				<view class="cu-form-group rem-user-item">
					<view class="title">手机</view>
					<input type="number" maxlength="11" placeholder="136XXXXXXXX" placeholder-style="color:#dfdfdf;" name="phone"
					 :value="phone"></input>
				</view>
			</view>
			<view>
				<view class="padding flex flex-direction rem-user-btn">
					<button formType="submit" class="cu-btn bg-blue lg submit-btn">确定</button>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	var _self;
	const dateUtil = require('../../utils/date.js');
	const interaction = require('../../utils/interaction.js');
	const tools = require('../../utils/tools.js');
	const db = wx.cloud.database();
	
	export default {
		data() {
			return {
				openId: '',
				recordId: '', // 返回的记录
				// percent: 0,
				sexPicker: [{
					'id': '1',
					'title': '男',
				}, {
					'id': '2',
					'title': '女',
				}],
				sexIndex: '0',
				sexId: '0',
				sexTitle: '未知',

				// userId: '',
				username: '',
				phone: '',
				avatarUrl: '',
			}
		},
		onLoad: function(option) {
			_self = this;

			_self.openId = option.openId;
			_self.avatarUrl = option.avatarUrl;
			_self.username = option.username;

			_self.getData();
		},
		methods: {
			sexPickerChange(e) {
				_self.sexIndex = e.target.value
				_self.sexId = _self.sexPicker[_self.sexIndex].id;
				_self.sexTitle = _self.sexPicker[_self.sexIndex].title;
			},

			getData: function() {
				// 查询当前用户所有的 counters
				db.collection('user').where({
					_openid: _self.openId
				}).get({
					success: res => {
						_self.recordId = res.data[0]._id;
						_self.avatarUrl = res.data[0].avatarUrl;
						_self.username = res.data[0].username;
						_self.phone = res.data[0].phone;
						// _self.sex = res.data[0].sex;

						// 性别
						_self.sexId = res.data[0].sex;
						if (_self.sexId > 0) {
							_self.sexIndex = tools.searchArr(_self.sexPicker, 'id', _self.sexId);
							_self.sexTitle = _self.sexPicker[_self.sexIndex].title;
						}
						console.log('[mineInfo查询记录] 成功')
					},
					fail: err => {
						console.error('[mineInfo查询记录] 失败：', err)
						interaction.errorModal('查询记录失败');
					}
				})
			},

			formSubmit: function(e) {

				//表单数据
				var formData = e.detail.value;
				// formData.username = _self.username;
				formData.openId = _self.openId;
				formData.sex = _self.sexId;
				formData.avatar = _self.avatarUrl;

				// 手机
				if (formData.phone != '' && (/^1[3456789]\d{9}$/.test(formData.phone) == false)) {
					return interaction.errorModal('输入正确的手机号');
				}
				
				console.log('表单提交',formData)
				if (_self.recordId !== '') {
					db.collection('user').doc(_self.recordId).update({
						data: {
							username: formData.username,
							phone: formData.phone,
							sex: formData.sex,
							avatar: formData.avatar
						},
						success: function(res) {
							console.log('用户信息更新成功')
						}
					})
				}else{
					db.collection('user').add({
						data: {
							// openid: formData.openId,
							username: formData.username,
							phone: formData.phone,
							sex: formData.sex,
							avatar: formData.avatar
						},
						success: function(res) {
							console.log('用户信息新增成功')
							_self.updateStorage(formData)
						}
					})
				}

				interaction.successToast('保存成功');
				uni.switchTab({
					url: '/pages/mine/mine'
				});

			},
			updateStorage(params) {
				let storageUserInfo = getApp().globalData.userInfo;
				storageUserInfo.nickName = params.username;
				uni.setStorage({
					key: 'userInfo',
					data: storageUserInfo,
					success: () => {
						getApp().globalData.userInfo = uni.getStorageSync('userInfo');
					}
				})
			}
		}
	}
</script>

<style>
	.submit-btn {
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.rem-user-avatar {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.rem-user-avatar .rem-user-avatar-img {
		margin-right: -460rpx;
	}

	.rem-user-item {
		border-top: 0rpx !important;
		padding-right: 40rpx !important;
	}

	.rem-user-item input {
		text-align: right;
		/* padding-right: 40rpx; */
	}

	.rem-user-btn {
		margin-top: 200rpx;
	}

	.rem-input-icon {
		font-size: 34rpx;
		color: #8799a3;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		margin-left: 10rpx;
		margin-right: -6rpx;
	}

	input {
		height: 44.8rpx;
	}
</style>
