var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');
var pageId = Fliplet.Env.get('pageId');

if (menuInstanceId) {
  init();
}

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};

  // Select active page
  $('.fl-bottom-bar-menu-holder li[data-page-id="' + pageId + '"]').find('.fl-bottom-bar-icon-holder').addClass('active');

  // Show more, when available
  $('li[data-show-more]').on('click', function() {
    var $parent = $(this).parents('.fl-bottom-bar-menu-holder');
    var totalMenuHeight = $parent.outerHeight(true);
    var hiddenHeight = totalMenuHeight - 65; // 65 is what is visible from the start

    if ( $parent.hasClass('expanded') ) {
      $parent.removeClass('expanded').css({
        'transform': 'translate3d(0px, -65px, 0)',
        'transform': 'translate3d(0px, calc(-65px - env(safe-area-inset-bottom), 0)',
      });
    } else {
      $parent.addClass('expanded').css({
        'transform': 'translate3d(0px, -' + totalMenuHeight + 'px, 0)',
        'transform': 'translate3d(0px, calc(-' + totalMenuHeight + ' - env(safe-area-inset-bottom), 0)',
      });
    }
  });

  $('[open-about-overlay]').on('click', function() {
    Fliplet.Navigate.to({
      action: 'about-overlay'
    });
  });
}