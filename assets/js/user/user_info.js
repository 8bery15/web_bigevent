$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 设置用户昵称的验证规则
    form.verify({
        nickname:function(value) {
            if(value.length > 6) {
                return '昵称长度必须在1 ~ 6个字符之间！'
            }
        }
    })
    initUserInfo();
// 初始化用户的基本信息
function initUserInfo() {
    
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success : function(res){
            if(res.status !== 0) {
                return layer.msg('获取用户基本信息失败')
            }
            // 快速为表单赋值
            console.log(res);
            // 调用 form.val() 快速为表单赋值
            form.val('formUserInfo',res.data);
        }
    })
}



// 点击重置按钮，进行信息重置
$('#btnReset').on('click',function(e) {
    // 阻止重置按钮默认行为 防止清空
    e.preventDefault();
    //更新用户基本信息
    initUserInfo();
})


// 实现表单的重置效果，点击提交按钮
// 监听表单提交事件
 // 监听表单的提交事件
 $('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        
        window.parent.getUserInfo();
    }
    })
  })

})
