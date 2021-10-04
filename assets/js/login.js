$(function () {


    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从layui中获取form 对象，引入js文件就可以有layui.form
    var form = layui.form;
    // 获取弹出层对象layer
    var layer = layui.layer;
    // 通过函数form.verify自定义校验规则



    form.verify({
        psw: [
            // 自定义了一个psw校验规则
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //   校验两次密码是否一致
        // 通过形参value是获取的再次确认密码的密码框的值
        //   还需要拿到密码框的内容
        // 还需要进行一次等于的判断
        // 如果判断失败就return一个提示消息即可



        repsw: function (value) {
            // 通过属性选择器获取密码框的内容
            var pwd = $('.reg-box [name=password]').val()
            
            // console.log(pwd);


            //console.log(value);

            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 是注册表单的数据
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
          }
        // 发起Ajax的post请求
        $.post('/api/reguser',data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录');
            // 模拟人的行为
            $('#link_login').click();
        })

    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单的数据
            data :$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功');
                console.log(res.token);//这个token用于有权限的身份认证
                // 把这个token存到本地存储
                localStorage.setItem('token',res.token);
                // 登录成功跳转到index.html
                location.href = '/index.html'
            }
        })
    })
})