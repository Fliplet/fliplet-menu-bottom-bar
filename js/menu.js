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

  $('[open-about-overlay]').on('click', function() {
    Fliplet.Navigate.to({
      action: 'about-overlay'
    });
  });
}