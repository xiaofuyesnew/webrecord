$(() => {

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

    app.setScreen()

    var $pick = $('#picker')
    var fileArray = []
	var fileNameArray = []

    var uploader = WebUploader.create({
        auto: false,
        server: 'http://120.76.203.56/api.php/Duty/uploadImg',
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
            <div id="${file.id}" name="${file.name}" class="file-item thumbnail pre"><img><a href="javascript:;" class="uploader_del"></a>
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

        $('.u-add').click(function () {
            //完成按钮功能
            uploader.upload(file)
            console.log('ok')
        })
    })

    uploader.on( 'uploadSuccess', function( file,response ) {

        console.log(file)
        console.log(response)
        /*
        if($.inArray(response.img_name, fileArray) < 0) {
    				
		    fileNameArray.push(file.name);
		    fileArray.push(response.img_name);
	    }
    			*/
	})
})