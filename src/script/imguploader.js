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
 */
var popupBtn = () => {
    
    $('body').append(`<div class="iu-mask"></div><div class="popupBtn"><div id="iu-camera" class="unit btn">拍照</div><div id="iu-photo" class="unit btn">相册</div><div id="iu-cancle" class="unit cancle">取消</div></div>`)

}

var showBtn = () => {

    if ($('.popupBtn').hasClass('animOut')) {

        $('.popupBtn').removeClass('animOut')

    }

    $('.popupBtn').addClass('animIn')
    $('.iu-mask').show()
}

var hideBtn = () => {

    if ($('.popupBtn').hasClass('animIn')) {
        
        $('.popupBtn').removeClass('animIn')
        
    }
    $('.popupBtn').addClass('animOut')
    $('.iu-mask').hide()
}

var getpicture = (source) => {
    if (source) {
        navigator.camera.getPicture(
            onPhotoSuccess, 
            function (error) {
                console.log("照片获取失败！")
            }, 
            { 
                destinationType: Camera.DestinationType.FILE_URI, 
                sourceType: source 
            }
        )
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

var onPhotoSuccess = (imgData) => {
    
}

var onDeviceReady = () => {
    popupBtn()

    $(document).on('click', '#iu-camera', function () {
        getpicture()
    })

    $(document).on('click', '#iu-photo', function () {
        getpicture(pictureSource.PHOTOLIBRARY)
    })
}

$(() => { 
    popupBtn()

    document.addEventListener("deviceready", onDeviceReady, false)

    $(document).on('click', '#iu-cancle', () => {
        hideBtn()
    })

    $(document).on('click', '.iu-mask', () => {
        hideBtn()
    })

    $('#btn').click(function () {
        showBtn()
    })
})