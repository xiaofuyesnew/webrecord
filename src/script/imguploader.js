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
var files = [],
    limit = 0,
    remark = 1

var showMsg = (msg) => {
    $('.msg').html(msg).show(() => {
        $('.msg').css({'opacity': '1'})
        setTimeout(() => {
            $('.msg').css({'opacity': '0'})
        }, 2000)
        setTimeout(() => {
            $('.msg').hide()
        }, 3000)
    })
}

var getUrlPrama = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return decodeURI(r[2])
        //unescape(r[2])
    } 
    return null
}

if (getUrlPrama('type') === '50' || getUrlPrama('type') === '100' || getUrlPrama('type') === '200' || getUrlPrama('type') === '201' || getUrlPrama('type') === '101' || getUrlPrama('type') === '102' || getUrlPrama('type') === '103' || getUrlPrama('type') === '104' || getUrlPrama('type') === '105' || getUrlPrama('type') === '106' || getUrlPrama('type') === '107' || getUrlPrama('type') === '108' || getUrlPrama('type') === '109') {
    limit = 1
}

if (getUrlPrama('type') === '50' || getUrlPrama('type') === '100' || getUrlPrama('type') === '200' || getUrlPrama('type') === '201') {
    remark = 0
}

var popupBtn = () => {
    
    $('body').append(`<div class="iu-mask"></div><div class="popupBtn"><div id="iu-camera" class="unit btn">拍照</div><div id="iu-photo" class="unit btn">相册</div><div id="iu-cancle" class="unit cancle">取消</div></div>`)

}

//弹出框弹出
var showBtn = () => {
    $('.popupBtn').animate({
        bottom: '0'
    }, 300)

    $('.iu-mask').show()
}

//弹出框收回
var hideBtn = () => {
    $('.popupBtn').animate({
        bottom: '-160px'
    }, 300)
    
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
    window.FilePath.resolveNativePath(imgData, function (r) {
        files.push(r)
        previewImg(r)  
    }, function (err) {
        files.push(imgData)
        previewImg(imgData)
    })
}

//图片预览功能
var previewImg = (imgData) => {
    $('#picker').before(`<div data-name="${imgData.substring(imgData.lastIndexOf('/') + 1)}" data-url="${imgData}" class="file-item thumbnail pre"><img src="${imgData}"><a href="javascript:;" class="uploader_del"></a></div>`)
}

//上传成功
var win = function (r) {
    //alert(JSON.stringify(r))
    //alert(JSON.parse(r.response).url)
    if (limit === 1 && remark === 0) {
        $('.remark').append(`<label class="rmkname"><img src="${JSON.parse(r.response).url}"></label><input class="rmkcontent" data-url="${JSON.parse(r.response).url}" type="hidden">`)
    } else {
        $('.remark').append(`<label class="rmkname"><img src="${JSON.parse(r.response).url}"></label><input class="rmkcontent" data-url="${JSON.parse(r.response).url}" type="text">`)
    }
    
    if (remark === 0) {
        $('.btncell .info').html('上传完成，请保存！')
    } else {
        $('.btncell .info').html('上传完成，请填写备注！')
    }
    
}

//上传失败
var fail = function (error) {
    //alert(JSON.stringify(error))
    alert('上传失败，请重试！')
}

var uploadImg = (files) => {
    
    for (var i = 0; i < files.length; i++) {
        $('.btncell .info').html('正在上传，请稍等...')
        var options = new FileUploadOptions(),
            fileName = files[i].substr(files[i].lastIndexOf('/') + 1)
        options.fileName = fileName
        options.mimeType = 'image/*'
        
        var params = {}
        params.uid = localStorage.uid
        params.username = localStorage.username
        params.password = localStorage.password
        options.params = params
        
        //alert(files[i])

        var ft = new FileTransfer()
        ft.upload(files[i], encodeURI(`http://120.76.203.56:8002/api.php/Duty/uploadImg`), win, fail, options)
    
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

    //上传按钮点击绑定
    $('#addbtn').click(function () {
        
        $('.remark').children().remove()
        uploadImg(files)
        
    })
}

//popupBtn()
//设备准备
document.addEventListener("deviceready", onDeviceReady, false)

$(() => { 
    

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
        if (limit === 1 && files.length) {
            showMsg('限制上传一张')
        } else {
            showBtn()
        }
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