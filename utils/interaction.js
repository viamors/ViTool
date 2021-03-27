export function errorModal(content, title = '') {
    return new Promise((res, rej) => {
        uni.showModal({
            title: title,
            content: content,
            showCancel: false,
            success(e) {
                res(e);
            },
            fail: (e) => {
                rej(e);
            }
        });
    });
}
export function successToast(content) {
    uni.showToast({
        title: '操作成功'
    });
}
export function showLoading(title, mask = true) {
    uni.showLoading({
            title: title,
            mask: mask
        }),
    uni.showNavigationBarLoading();
}

export function hideLoading() {
    uni.hideLoading();
    uni.hideNavigationBarLoading();
}
export function showToast(title, icon = 'success') {
    return new Promise((res, rej) => {
        uni.showToast({
            title: title,
            icon: icon,
            success(e) {
                res(e);
            },
            fail: (e) => {
                rej(e);
            }
        });
    });
}
