$(document).ready(function () {
    // Initialize Semantic UI components
    $(".ui.dropdown").dropdown();

    $('.message .close')
        .on('click', function () {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        });
});