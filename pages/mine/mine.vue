<template>
	<view class="rem-mine">

		<view class="padding solid-bottom">
			<view class="rem-avatar">
				<image :src="userInfo.avatarUrl"></image>
			</view>

			<!-- <view class="user-name">{{ openid }}</view> -->
			<view class="user-name">Hi，{{ userInfo.nickName }}</view>

			<view v-if="!isLogin">
				<button class="cu-btn line-gray round xq-btn-sm" @getuserinfo="onLogin" open-type="getUserInfo">授权登录</button>
			</view>
		</view>


		<!-- <view v-if="isLogin" class="rem-btn rem-user-list"> -->
		<view class="rem-btn rem-user-list">
			<view class="rem-user-list-item cu-tag light bg-blue" @tap="userDetailInfo">个人信息</view>
			<view class="rem-user-list-item cu-tag bg-blue" @tap="equipManage">我的预约</view>
			<view class="rem-user-list-item cu-tag light bg-blue" @tap="geneFlora">预约情况</view>
			<view class="rem-user-list-item cu-tag bg-blue" @tap="setDate">设置中心</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				isLogin: false,
				openid: '',
				userInfo: {
					avatarUrl: '../../static/img/user-unlogin.png',
					nickName: '暂未登录'
				},
				avatarUrl: ''
			}
		},
		onLoad(option) {
			_self = this;
			_self.getUserSetting();

			if (getApp().globalData.openid) {
				_self.openid = getApp().globalData.openid;
				_self.userInfo = getApp().globalData.userInfo;

			} else {
				_self.onGetOpenid();
			}

		},
		onShow: function() {
			console.log('openId', _self.openid)
		},
		methods: {
			getUserSetting: function() {
				// 获取用户信息
				wx.getSetting({
					success: res => {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
							wx.getUserInfo({
								success: res => {
									_self.userInfo = res.userInfo;
									_self.isLogin = true;
								}
							})
						}
					}
				})
			},
			onLogin: function() {
				_self.onGetOpenid();
				_self.getUserSetting();
			},
			onGetOpenid: function() {
				// 调用云函数
				wx.cloud.callFunction({
					name: 'login',
					data: {},
					success: res => {
						console.log('[云函数] [login] user openid: ', res.result.openid)
						getApp().globalData.openid = res.result.openid
						_self.openid = res.result.openid;
					},
					fail: err => {
						console.error('[云函数] [login] 调用失败', err)
					}
				})
			},
			
			setDate: function() {
				uni.navigateTo({
					url: '../setDate/setDate'
				});
			},
			userDetailInfo: function() {

				let openId = _self.openid;
				let avatarUrl = _self.userInfo.avatarUrl;
				let nickName = _self.userInfo.nickName;

				uni.navigateTo({
					url: './mine_info?openId=' + openId + '&avatarUrl=' + avatarUrl + '&username=' + nickName
				});
			}
		}
	}
</script>

<style>
	.rem-mine {
		margin-top: 50rpx;
		text-align: center;
	}

	.rem-avatar image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
		border: 2rpx solid #ccc;
	}

	.rem-user-list {
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
	}

	.rem-user-list .rem-user-list-item {
		width: 500rpx;
		height: 92rpx;
		border-radius: 30rpx;
		margin-top: 20rpx;
		margin-left: 150rpx;
		text-align: center;
	}
</style>
