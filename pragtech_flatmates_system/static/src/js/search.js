odoo.define('pragtech_flatmates.serach', function (require) {

$(document).ready(function() {
 $("#rooms").on("click", function()

{
    $('.navbar').attr('style', 'background-color: #dc3545  !important')

    });

$("#flatmates").on("click", function()

    {
        $('.navbar').attr('style', 'background-color: #17a2b8  !important')


    });

    $("#teamups").on("click", function()

    {
        $('.navbar').attr('style', 'background-color: #ffc107  !important')


    });


})
})