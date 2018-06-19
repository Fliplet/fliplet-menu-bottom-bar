var $menuElement = $('[data-name="Bottom bar"]');
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
  $('[data-show-more]').on('click', function() {
    var totalMenuHeight = $('.fl-bottom-bar-menu-holder').outerHeight(true);
    var hiddenHeight = totalMenuHeight - 65; // 65 is what is visible from the start

    if ( $('.fl-bottom-bar-menu-holder').hasClass('expanded') ) {
      $('.fl-bottom-bar-menu-holder').removeClass('expanded').css({
        'transform': 'translate3d(0px, -65px, 0)'
      });
    } else {
      $('.fl-bottom-bar-menu-holder').addClass('expanded').css({
        'transform': 'translate3d(0px, -' + totalMenuHeight + 'px, 0)'
      });
    }
  });

  $('[open-about-overlay]').on('click', function() {
    Fliplet.Navigate.to({
      action: 'about-overlay'
    });
  });
}