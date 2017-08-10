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
        <div id="${file.id}" class="file-item thumbnail pre"><img style="width: 100%; height: 100%;"><a href="javascript:;" class="uploader_del"></a>
        </div>
    `)
    var $img = $li.find('img')

    // $list为容器jQuery实例
    $pick.before($li)
    //$list.append(  )
    $('.imglist').find('.uploader_del').unbind('click').click(function() {
        var fname = $(this).parent().attr('name')

		for(var i = 0; i < fileNameArray.length; i++) {
            
			if(fname == fileNameArray[i]) {
				fileArray.splice(i, 1)
				fileNameArray.splice(i, 1)
			}
		}
		$('#filearray').val(fileArray);
		$(this).parent().remove();
		if($('.imglist').find('.file-item').length == 0) {
			$('.tip_text').show()
		}
	})      
    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr( 'src', src );
    });
});

    $('.u-add').click(function () {
        //完成按钮功能
    })
})