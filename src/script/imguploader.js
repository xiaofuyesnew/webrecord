/**
 * imguploader for cordova 
 * 
 * version 0.9.0
 * 
 * author: Allen Wong
 * 
 * create date: 2017-08-15
 * 
 * last modified: 2017-08-15
 * 
 * log: 
 *      2017-08-15   init
 *      2017-08-16   uploader
 */

//document注入弹出框
var files = []

var popupBtn = () => {
    
    $('body').append(`<div class="iu-mask"></div><div class="popupBtn"><div id="iu-camera" class="unit btn">拍照</div><div id="iu-photo" class="unit btn">相册</div><div id="iu-cancle" class="unit cancle">取消</div></div>`)

}

//弹出框弹出
var showBtn = () => {

    if ($('.popupBtn').hasClass('animOut')) {

        $('.popupBtn').removeClass('animOut')

    }

    $('.popupBtn').addClass('animIn')
    $('.iu-mask').show()
}

//弹出框收回
var hideBtn = () => {

    if ($('.popupBtn').hasClass('animIn')) {
        
        $('.popupBtn').removeClass('animIn')
        
    }
    $('.popupBtn').addClass('animOut')
    $('.iu-mask').hide()
}

//获取图片cordova的camera插件
var getpicture = (source) => {
    
    //如果有source证明是来自相册
    if (source) {
        navigator.camera.getPicture(
            onPhotoSuccess, 
            function (error) {
                console.log("照片获取失败！")
            }, 
            { 
                destinationType: Camera.DestinationType.FILE_URI, 
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY 
            }
        )

    //不传source来自相机
    } else {
        navigator.camera.getPicture(
            onPhotoSuccess, 
            function (error) {
                console.log("照片获取失败！")
            }, 
            { 
                destinationType: Camera.DestinationType.FILE_URI
            }
        )
    }
}

//获取照片后的回调函数
var onPhotoSuccess = (imgData) => {
    files.push(imgData)
    previewImg(imgData)
}

//图片预览功能
var previewImg = (imgData) => {
    $('#picker').before(`<div data-name="${imgData.substring(imgData.lastIndexOf('/') + 1)}" data-url="${imgData}" class="file-item thumbnail pre"><img src="${imgData}"><a href="javascript:;" class="uploader_del"></a></div>`)
}

//上传成功
var win = function (r) {
    alert("Code = " + r.responseCode);
    alert("Response = " + r.response);
    alert("Sent = " + r.bytesSent);
}

//上传失败
var fail = function (error) {
    alert("上传失败! Code = " + error.code);
}

//初始化参数
var options = new FileUploadOptions(),
    params = {},
    ft = new FileTransfer()

var uploadImg = (files) => {
    for (var i = 0; i < files.length; i++) {
        options.fileName = files[i].substr(files[i].lastIndexOf('/') + 1)
        options.mimeType = 'image/*'
        
        params.username = localStorage.username
        params.password = localStorage.password
        options.params = params
        
        ft.upload(fileURL, encodeURI("http://120.76.203.56:8002/api.php/Duty/uploadImg"), win(r), fail(error), options);
    }
}

//设备准备好后调用函数-
var onDeviceReady = () => {
    popupBtn()

    $(document).on('click', '#iu-camera', function () {
        getpicture()
        hideBtn()
    })

    $(document).on('click', '#iu-photo', function () {
        getpicture(1)
        hideBtn()
    })
}

$(() => { 
    popupBtn()
    //设备准备
    document.addEventListener("deviceready", onDeviceReady, false)

    //取消按钮点击绑定
    $(document).on('click', '#iu-cancle', () => {
        hideBtn()
    })

    //遮罩点击绑定
    $(document).on('click', '.iu-mask', () => {
        hideBtn()
    })

    //添加按钮点击绑定
    $('#picker').click(function () {
        showBtn()
    })

    //预览删除点击绑定
    $(document).on('click', '.imglist .uploader_del', function() {
        for (var i = 0; i < files.length; i++) {
            if ($(this).parent().attr('data-url') === files[i]) {
                files.splice(i, 1)
            }
        }
        $(this).parent().remove()
    })  
})