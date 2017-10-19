$(() => {

    var onDeviceReady = function() {
        navigator.geolocation.getCurrentPosition(function(position){}, function(error){})
    }

    document.addEventListener("deviceready", onDeviceReady, false)

    //创建根节点对象
    var app = {
        el: $('#app'),
        setScreen: () => {
            app.el.css({"height": `${window.innerHeight - 20}px`})
        },
        showMsg: (msg) => {
            $('.msg').html(msg).show(() => {
                $('.msg').css({'opacity': '1'})
                setTimeout(() => {
                    $('.msg').css({'opacity': '0'})
                }, 2000)
                setTimeout(() => {
                    $('.msg').hide()
                }, 3000)
            })
        },
        getUrlPrama: (name) => {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            } 
            return null
        }
    }

    //调用方法
    app.setScreen()

    var map, geolocation, geocoder;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });

    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder();
    //TODO: 使用geocoder 对象完成相关功能
    })

    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
    //解析定位结果
    /**/ 
    function onComplete(data) {
        var posXY = [data.position.getLng(), data.position.getLat()]
        geocoder.getAddress(posXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                $('#address').val(result.regeocode.formattedAddress)
                app.showMsg('定位成功，可以签到')
            }else{
                app.showMsg('获取地址失败')
            }
        })
    }

    //解析定位错误信息
    function onError(data) {
        app.showMsg('定位失败')
    }


    //签到
    $('.btn').click(function () {
        if ($('#address').val()) {
            $.ajax({
                url: 'http://120.76.203.56:8002/api.php/Duty/sign',
                type: 'POST',
                data: `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&uid=${localStorage.uid}&familyid=${app.getUrlPrama('familyid')}&address=${$('#address').val()}`,
                success: (data) => {
                    console.log(JSON.parse(data))
                    app.showMsg(JSON.parse(data).info)
                    setTimeout(() => {
                        window.location = 'poorlist.html'
                    }, 2000)
                }
            })
        } else {
            app.showMsg('定位未成功，无法签到')
        }
    })
})