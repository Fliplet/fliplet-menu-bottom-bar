var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');
var pageId = Fliplet.Env.get('pageId');

if (menuInstanceId) {
  init();
}

function init() {
  $('body').addClass('fl-menu-bottom-bar');
  var data = Fliplet.Widget.getData(menuInstanceId) || {};

  // Select active page
  $('.fl-bottom-bar-menu-holder li[data-page-id="' + pageId + '"]').addClass('active');

  // Show more, when available
  $('li[data-show-more]').on('click', function() {
    var $parent = $(this).parents('.fl-bottom-bar-menu-holder');
    var totalMenuHeight = $parent.outerHeight(true);
    var hiddenHeight = totalMenuHeight - 65; // 65 is what is visible from the start

    if (!$parent.hasClass('expanded')) {
      $parent.addClass('expanded').css({
        'transform': 'translate3d(0px, -' + totalMenuHeight + 'px, 0)'
      });
    } else if (Modernizr.notch) {
      $parent.removeClass('expanded').css({
        'transform': 'translate3d(0px, calc(-65px - env(safe-area-inset-bottom)), 0)'
      });
    } else if ($('html').is('[data-has-notch]')) {
      $parent.removeClass('expanded').css({
        'transform': 'translate3d(0px, -99px, 0)'
      });
    } else {
      $parent.removeClass('expanded').css({
        'transform': 'translate3d(0px, -65px, 0)'
      });
    }
  });

  $('.fl-bottom-bar-menu-holder li').not('[data-show-more]').on('click', function() {
    $('.fl-bottom-bar-menu-holder li').removeClass('active');
    $(this).addClass('active');
  });

  $('[open-about-overlay]').on('click', function() {
    Fliplet.Navigate.to({
      action: 'about-overlay'
    });
  });
}