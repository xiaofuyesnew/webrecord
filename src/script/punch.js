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
        resizeEnable: true,
        zoom: 10,
        center: [111.640645,31.061092]
    });

    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
            city: '0717'
        });
    //TODO: 使用geocoder 对象完成相关功能
    })
    
    
    //解析定位结果
    /**/ 
    var selfLoc,
        marker,
        markers = [],
        locStatus = 0  //0表示自动定位，1表示手动定位
    function addL() {
        selfLoc = AMap.event.addListener(map, "click", function(e){
            //alert(JSON.stringify(e.lnglat))
            if (marker) {
                map.remove(markers)
            }
            marker = new AMap.Marker({
                map: map,
                bubble: true
            })
            marker.setPosition(e.lnglat);
            markers.push(marker)
            geocoder.getAddress(e.lnglat,function(status,result){
                //console.log(result.regeocode.formattedAddress)
                //$('#address').val(result.regeocode.formattedAddress)
                $('#maddress').val(result.regeocode.formattedAddress)
                app.showMsg('定位成功，可以签到')
            })
        })
    }

    function removeL() {
        if (selfLoc) {
            AMap.event.removeListener(selfLoc)
        }
        map.remove(markers)
    }

    map.plugin('AMap.Geolocation', function() {

        /* if (localStorage.platform === 'Android') {*/
             geolocation = new AMap.Geolocation({
                 enableHighAccuracy: false,//是否使用高精度定位，默认:true
                 timeout: 5000,          //超过10秒后停止定位，默认：无穷大
                 buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                 zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                 buttonPosition:'RB'
             })
             /*
         } else {
             geolocation = new AMap.Geolocation({
                 enableHighAccuracy: true,//是否使用高精度定位，默认:true
                 timeout: 5000,          //超过10秒后停止定位，默认：无穷大
                 buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                 zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                 buttonPosition:'RB'
             })
         }*/
         map.addControl(geolocation)
         geolocation.getCurrentPosition()
         AMap.event.addListener(geolocation, 'complete', onComplete)//返回定位信息
         AMap.event.addListener(geolocation, 'error', onError);    //返回定位出错信息
     })

    function onComplete(data) {
        locStatus = 0
        if ($('#maddress').length > 0) {
            $('#maddress').remove()
            removeL()
        }
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
        locStatus = 1
        app.showMsg('定位失败,开启手动定位')
        //alert(JSON.stringify(data))
        if ($('#maddress').length > 0) {
            $('#maddress').val('')
            removeL()
        } else {
            $('#container').after('<input id="maddress" type="text" disabled>')
        }
        AMap.plugin('AMap.Geocoder', addL())
    }

    //签到
    $('.btn').click(function () {
        if (locStatus === 0) {
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
        } else if (locStatus === 1) {
            if ($('#maddress').val()) {
                $.ajax({
                    url: 'http://120.76.203.56:8002/api.php/Duty/sign',
                    type: 'POST',
                    data: `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&uid=${localStorage.uid}&familyid=${app.getUrlPrama('familyid')}&address=${$('#maddress').val()}`,
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
        }
    })
})