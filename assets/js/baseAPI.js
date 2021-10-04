// 注意：每次调用 $.post() 或 $.get() 或 $.ajax()的时候会先调用这个$.ajaxPrefilter()函数
// 在这个函数中我们可以拿到提供给ajax的配置对象options
$.ajaxPrefilter(function(options) {
    // 再发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);
})