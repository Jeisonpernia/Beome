odoo.define('pragtech_flatmates.back_button', function (require) {



$(document).ready(function() {

        $(document).on('click','.go_back',function()
        {
           window.location.replace('/listplace/describe-your-place/accommodation')
//
        })

        if (window.location.pathname=='/listplace/describe-your-place/accommodation' && localStorage.getItem('list_place_array'))
        {
            console.log("--------------**---------------",localStorage.getItem('list_place_array'))
            $('.whole-property').removeClass('items-cirle-hover')
            $('.whole-property').addClass('accommodation-listing-item-active')
            $('.whole-property').find('path').addClass('active_svg_icon')
            $('<div src="" class="active_tick_icon"></div>').insertAfter(".whole-property");

        }





})
})