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
    
    $('body').append(`<div class="popupBtn"></div>`)

}

var showBtn = (btn) => {
    $('.ui-mask').show()
}

var hideBtn = (btn) => {
    
    $('.ui-mask').hide()
}

var onDeviceReady = () => {
    popupBtn()

    $()
}

$(() => { 
    document.addEventListener("deviceready", onDeviceReady, false)

    $(document).on('click', '#iu-cancle', () => {
        hideBtn('#iu-cancle')
    })
})