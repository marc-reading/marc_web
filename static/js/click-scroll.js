// Fixed click-scroll for MARC
// Handles sticky navbar, SVG sections, correct menu highlighting

$(document).ready(function () {

    var $navLinks = $('.navbar-nav .nav-link');
    var $sections = $('section[id]');
    var navHeight = $('.navbar').outerHeight() || 90;

    // Smooth scroll on click
    $navLinks.on('click', function (e) {
        var targetID = $(this).attr('href');

        if (targetID.startsWith('#')) {
            e.preventDefault();

            var $target = $(targetID);
            if ($target.length) {
                $('html, body').animate(
                    {
                        scrollTop: $target.offset().top - navHeight
                    },
                    400
                );
            }
        }
    });

    // Active menu on scroll
    $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + navHeight + 10;

        $sections.each(function () {
            var $section = $(this);
            var top = $section.offset().top;
            var bottom = top + $section.outerHeight();
            var id = $section.attr('id');

            if (scrollPos >= top && scrollPos < bottom) {
                $navLinks.removeClass('active').addClass('inactive');
                $('.navbar-nav .nav-link[href="#' + id + '"]')
                    .addClass('active')
                    .removeClass('inactive');
            }
        });
    });

    // Initial state
    $navLinks.addClass('inactive');
    $navLinks.eq(0).addClass('active').removeClass('inactive');

});
