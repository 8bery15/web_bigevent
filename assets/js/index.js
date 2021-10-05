$(function () {

    getUserInfo();
    // 实现退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // console.log('ok');
        // 提示用户是否确认退出
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token值
            localStorage.removeItem('token');
            //2.返回登录页面
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
        });

    })


})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败')
            }
            // 调用renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        // 控制用户的访问权限，无论访问成功还是失败，都会执行complete回调函数
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status !== 0 && res.responseJSON.message !== '获取用户基本信息成功！') {
        //         // 1.强制清空token值
        //         localStorage.removeItem('token');
        //         //2.强制返回登录页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}
//渲染用户头像
function renderAvatar(users) {
    // 1.获取用户名称，判断是昵称还是用户名
    var name = users.username || users.nickname;
    // 2.渲染用户名到欢迎文本框内
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    //3.渲染用户头像
    if (users.user_pic !== null) {
        //3.1渲染图片头像 给图片的src属性赋一个值
        $('.layui-nav-img').attr('src', users.user_pic).show();
        $('text-avatar').hide();
    } else {
        //3.2渲染文本头像
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }


}