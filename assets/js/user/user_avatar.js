$(function() {
var layer = layui.layer;
    // 实现基本的裁剪效果
     // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比  实现裁剪的区域，以什么形状进行裁剪
    aspectRatio: 1,
    // 指定预览区域 
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域 把配置项传递给DOM元素
  $image.cropper(options);

// 为选择图片按钮绑定一个点击事件
$('#btnChooseImage').on('click',function() {
    // 点击选择图片按钮手动模拟点击选择文件框
    $('#file').click();
})


// 为文件选择框绑定一个change事件 文件一变化就出发了这个事件
$('#file').on('change',function(e) {
console.log(e);
// 获取用户选择的文件
var fileList = e.target.files;
console.log(fileList);
if(fileList.length === 0) {
    return layer.msg('请选择图片')
}
// 如果文件不为0，则把图片替换到裁剪区域
// 拿到用户选择的文件
var files = fileList[0];
console.log(files);
// 把文件转化为url路径 url的方法
var imgURL = URL.createObjectURL(files);

  // 3. 重新初始化裁剪区域
  $image
  .cropper('destroy') // 销毁旧的裁剪区域
  .attr('src', imgURL) // 重新设置图片路径
  .cropper(options) // 重新初始化裁剪区域

})

// 为上传头像按钮绑定点击事件
$('#btnUpLoad').on('click',function() {
    // 拿到用户裁剪之后的图像
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    //   调用接口将裁剪后的头像上传到服务器，进行渲染
    $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
            avatar: dataURL},
        success:function(res) {
            console.log(res);
            if(res.status !== 0) {
                return layer.msg('更新头像失败')
            }
            layer.msg('更新头像成功')
            window.parent.getUserInfo();
        }
    })
})
}) 