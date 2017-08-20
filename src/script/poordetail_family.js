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
        },
        showSingleImg: (pick, img) => {
            //添加节点
            $('body').append(`
                <div id="${pick.substr(1)}Big" class="imgshow">
                    <img src="${img}">
                </div>`)
            $(pick).click(function () {
                $(`${pick}Big`).show()
            })
            $('.imgshow').click(function () {
                $(this).hide()
            })
        }
    }

    //调用方法
    app.setScreen()
    console.log(app.getUrlPrama('table_id'))

    $('.uploader').click(function () {
        window.location = `uploader.html?familyid=${app.getUrlPrama('table_id')}&table_id=${$('.uploader').attr('data-family')}&type=100&mark=&filingyear=${$('.uploader').attr('data-year')}&title=家庭成员照片`
    })

    //收起展开
    $('.arrow').click(function () {
        if ($(this).hasClass('up')) {
            $(this).removeClass('up').addClass('down')
            $(this).parent().next().slideToggle()
        } else {
            $(this).removeClass('down').addClass('up')
            $(this).parent().next().slideToggle()
        }
    })

    $.ajax({
        url: 'http://120.76.203.56:8002/api.php/Duty/poorDetail',
        type: 'POST',
        data: `uid=${localStorage.uid}&username=${localStorage.username}&password=${localStorage.password}&table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {
            var family = JSON.parse(data).data.familys[+(app.getUrlPrama('no'))]
            console.log(JSON.parse(data).data)
            console.log(JSON.parse(data).data.familys[+(app.getUrlPrama('no'))])
            $('.uploader').attr('data-year', JSON.parse(data).data.poor.filingyear)
            $('.uploader').attr('data-family', family.table_id)
            $('#name').html(JSON.parse(data).data.poor.name)
            $('#area').html(JSON.parse(data).data.poor.townname + '&nbsp;' + JSON.parse(data).data.poor.villagename)
            $('#familyname').html(family.name)
            $('#sex').html(family.sex)
            $('#birthday').html(family.birthday)
            $('#relation').html(family.relationship)
            $('#education').html(family.educationdegree)
            $('#school').html(family.studenstatus)
            $('#skill').html(family.worksituation)
            $('#health').html(family.healthcondition)
            

            if (!family.icon) {
                $('.photo').html('<div class="unit nodata">暂无家庭照片信息</div>')
            } else {
                $('.photo').append(
                    `<div class="unit flex">
                        <img id="familyIcon" src="${family.icon}">
                    </div>`
                )
                app.showSingleImg('#familyIcon', family.icon)
            }
        }
    })
})