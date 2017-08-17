$(() => {
    /*
    document.addEventListener("deviceready", onDeviceReady, false)

    function onDeviceReady() {
        $('#picker').click(function () {
            navigator.camera.getPicture(onSuccess, onFail, {})
        })

        function onSuccess(imageData) {
            //var image = document.getElementById('myImage');
            //image.src = "data:image/jpeg;base64," + imageData;
            //alert(imageData)
        }
      
        function onFail(message) {
            alert(message)
        }
    }
    */


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
                return decodeURI(r[2])
                //unescape(r[2])
            } 
            return null
        }
    }

    app.setScreen()

    //显示标题
    $('.m-title').html(app.getUrlPrama('title'))

    /*
    var prama = `familyid=${app.getUrlPrama('familyid')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=`
    var $pick = $('#picker')
    var fileArray = []
    var fileNameArray = []
    
    var uploader = WebUploader.create({
        auto: false,
        server: 'http://120.76.203.56:8002/api.php/Duty/uploadImg',
        pick: '#picker',
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png,gif,bmp',
            mimeTypes: 'image/*'
        }
    })

    uploader.on( 'fileQueued', function( file ) {
        console.log(file)
        var $li = $(`
            <div id="${file.id}" name="${file.name}" class="file-item thumbnail pre">
                <img>
                <a href="javascript:;" class="uploader_del"></a>
            </div>
        `)
        var $img = $li.find('img')

        // $list为容器jQuery实例
        $pick.before($li)
        //$list.append(  )
        $('.imglist').find('.uploader_del').unbind('click').click(function() {
            var fname = $(this).parent().attr('name'),
                fid = $(this).parent().attr('id')

		    for(var i = 0; i < fileNameArray.length; i++) {
            
			    if(fname == fileNameArray[i]) {
				    fileArray.splice(i, 1)
				    fileNameArray.splice(i, 1)
			    }
		    }
            $(this).parent().remove()
            uploader.removeFile( fid )
            app.showMsg('已删除')
	    })      
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>')
                return;
            }

            $img.attr( 'src', src )
        })

        $('.addbtn').click(function () {
            //完成按钮功能
            $('.remark').children().remove()
            uploader.upload(file)
        })
    })

    uploader.on('uploadSuccess', function(file, response) {
        
        console.log(response)
        
        $('.remark').append(`
            <label class="rmkname">${file.name}</label>
            <input class="rmkcontent" data-url="${response.url}" type="text">
        `)

        if (uploader.getStats().progressNum !== 0) {
            $('.btncell .info').html(`上传进度：${uploader.getStats().successNum}/${uploader.getStats().progressNum + uploader.getStats().progressNum}`)
        } else {
            $('.btncell .info').html('上传完成，请填写备注！')
        }
    })
    */

    var prama = `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&familyid=${app.getUrlPrama('familyid')}&type=${app.getUrlPrama('type')}&mark=${app.getUrlPrama('mark')}&filingyear=${app.getUrlPrama('filingyear')}&sorder=`

    $('.u-add').click(function () {

        for (var i = 0; i < $('.rmkcontent').length; i ++) {
            console.log(`${prama}&picture=${$($('.rmkcontent')[i]).attr('data-url')}&remark=${$($('.rmkcontent')[i]).val()}`)
            $.ajax({
                url: 'http://120.76.203.56:8002/api.php/Duty/saveImg',
                type: 'POST',
                data: `${prama}&picture=${$($('.rmkcontent')[i]).attr('data-url')}&remark=${$($('.rmkcontent')[i]).val()}`,
                async: false,
                success: (data) => {
                    //alert(data)
                    if ($('.rmkcontent').length === i + 1) {
                        app.showMsg('信息已经保存')
                        window.location = history.go(-1)
                    }
                }
            })
        }
    })
})