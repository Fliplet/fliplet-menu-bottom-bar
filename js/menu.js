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
    $parent.toggleClass('expanded');
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