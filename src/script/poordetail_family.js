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

    //调用方法
    app.setScreen()
    console.log(app.getUrlPrama('table_id'))

    $.ajax({
        url: 'http://test.360guanggu.com/fupingv1/api.php/Macro/poorDetail',
        type: 'POST',
        data: `table_id=${app.getUrlPrama('table_id')}`,
        success: (data) => {
            var family = JSON.parse(data).data.familys[+(app.getUrlPrama('no'))]
            console.log(JSON.parse(data).data)
            console.log(JSON.parse(data).data.familys[+(app.getUrlPrama('no'))])
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
                        <img src="http://test.360guanggu.com${family.icon}">
                    </div>`
                )
            }
        }
    })
})