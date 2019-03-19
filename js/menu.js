var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');
var pageId = Fliplet.Env.get('pageId');

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};
  $('body').addClass('fl-menu-bottom-bar');

  // Add exit app link
  Fliplet.Hooks.on('addExitAppMenuLink', function () {
    if ($menuElement.find('li[data-fl-navigate*="exit-app"]').length) {
      return;
    }

    var $li = $([
      '<li class="linked" data-fl-exit-app>',
        '<div class="fl-bottom-bar-icon-holder">',
          '<div class="fl-menu-icon">',
            '<i class="fa fa-sign-out"></i>',
          '</div>',
          '<div class="fl-menu-title">',
            '<span>Exit app</span>',
          '</div>',
        '</div>',
      '</li>'
    ].join(''));
    $li.on('click', function onExitClick() {
      Fliplet.Navigate.exitApp();
    });
    $menuElement.find('ul').append($li);

    // Prevent default "Exit app" link from being added
    return Promise.reject('');
  });

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

if (menuInstanceId) {
  init();
}