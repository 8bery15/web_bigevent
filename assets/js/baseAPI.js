// 注意：每次调用 $.post() 或 $.get() 或 $.ajax()的时候会先调用这个$.ajaxPrefilter()函数
// 在这个函数中我们可以拿到提供给ajax的配置对象options
$.ajaxPrefilter(function(options) {
    // 再发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url);


    // 统一为有权限的接口设置请求头部headers
    options.headers = {
        Authorization:localStorage.getItem('token') || ''
    }

    // 优化控制用户的访问权限
    options.complete = function(res) {
        // console.log(res);
            if (res.responseJSON.status !== 0 && res.responseJSON.message !== '获取用户基本信息成功！') {
                // 1.强制清空token值
                localStorage.removeItem('token');
                //2.强制返回登录页面
                location.href = '/login.html'
    }
})