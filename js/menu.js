var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');
var pageId = Fliplet.Env.get('pageId');

function addMenuLink(html) {
  if (!html) {
    return;
  }

  var moreLink = [
    '<li data-show-more>',
      '<div class="fl-bottom-bar-icon-holder">',
        '<div class="fl-menu-icon">',
          '<i class="fa fa-chevron-up"></i>',
        '</div>',
        '<div class="fl-menu-title">',
          '<span class="more">More</span><span class="hide">Hide</span>',
        '</div>',
      '</div>',
    '</li>'
  ].join('');
  var res;

  $menuElement.find('.fl-bottom-bar-menu-holder').each(function () {
    var $menuHolder = $(this);
    var type = $menuHolder.hasClass('fl-bottom-bar-menu-holder-mobile') ? 'mobile' : 'tablet';
    var maxIcons = {
      mobile: 5,
      tablet: 8
    };

    if ($menuHolder.find('li').length === maxIcons[type]) {
      var $shiftedMenuItem = $menuHolder.find('li').eq(maxIcons[type] - 1);
      $shiftedMenuItem.css('display', 'none').before(moreLink);
      $menuHolder.addClass('multiple');
      setTimeout(function () {
        $shiftedMenuItem.css('display', '');
      }, 0);
    }

    var $li = $(html);
    $menuHolder.find('ul').append($li);
    if (!res) {
      res = $li;
    } else {
      res = res.add($li);
    }
  });

  return res;
}

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};
  $('body').addClass('fl-menu-bottom-bar');

  Fliplet.Hooks.on('addMenuLink', function (data) {
    data = data || {};
    return addMenuLink(data.html);
  });

  // Add exit app link
  Fliplet.Hooks.on('addExitAppMenuLink', function () {
    if ($menuElement.find('li[data-fl-navigate*="exit-app"]').length) {
      return Promise.reject(true);
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
    addMenuLink($li);

    // Prevent default "Exit app" link from being added
    return Promise.reject(true);
  });

  // Select active page
  $('.fl-bottom-bar-menu-holder li[data-page-id="' + pageId + '"]').addClass('active');

  // Show more, when available
  $menuElement.on('click', 'li[data-show-more]', function() {
    var $parent = $(this).parents('.fl-bottom-bar-menu-holder');
    $parent.toggleClass('expanded');
  });

  $menuElement.on('click', '.fl-bottom-bar-menu-holder li:not([data-show-more])', function() {
    $('.fl-bottom-bar-menu-holder li.active').removeClass('active');
    $(this).addClass('active');
  });

  $menuElement.on('click', '[open-about-overlay]', function(e) {
    e.preventDefault();
    Fliplet.Navigate.to({
      action: 'about-overlay'
    });
  });
}

if (menuInstanceId) {
  init();
}