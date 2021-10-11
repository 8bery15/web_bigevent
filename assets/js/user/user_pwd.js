$(function () {
    var form = layui.form;
    var layer = layui.layer;



    // 设置校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return layer.msg('新旧密码不能相同！')
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return layer.msg('两次密码不一致！')
            }
        }
    })




    // 实现重置密码功能  表单提交事件 表单已提交发起请求获取数据提交给服务器
    $('.layui-form').on('submit',function(e) {
        e.preventDefault();
        $.ajax({
            method :'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                // 更新密码成功后重置一下  这个重置方法是dom元素的，所以需要转成dom对象
                $('.layui-form')[0].reset()
            }
        })
    })
})