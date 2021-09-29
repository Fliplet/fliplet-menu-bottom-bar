var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');

$($menuElement).translate();

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};

  $('body').addClass('fl-menu-bottom-bar');

  // Add exit app link
  Fliplet.Hooks.on('addExitAppMenuLink', function() {
    var moreLink = [
      '<li data-show-more>',
      '<div class="fl-bottom-bar-icon-holder">',
      '<div class="fl-menu-icon">',
      '<i class="fa fa-chevron-up"></i>',
      '</div>',
      '<div class="fl-menu-title">',
      '<span class="more">' + T('widgets.menu.bottomBar.actions.more') + '</span><span class="hide">' + T('widgets.menu.bottomBar.actions.more') + '</span>',
      '</div>',
      '</div>',
      '</li>'
    ].join('');

    $menuElement.find('.fl-bottom-bar-menu-holder').each(function() {
      var $menuHolder = $(this);
      var type = $menuHolder.hasClass('fl-bottom-bar-menu-holder-mobile') ? 'mobile' : 'tablet';
      var maxIcons = {
        mobile: 5,
        tablet: 8
      };

      if ($menuHolder.find('li[data-fl-navigate*="exit-app"]').length) {
        return;
      }

      if ($menuHolder.find('li').length === maxIcons[type]) {
        var $shiftedMenuItem = $menuHolder.find('li').eq(maxIcons[type] - 1);

        $shiftedMenuItem.css('display', 'none').before(moreLink);
        $menuHolder.addClass('multiple');
        setTimeout(function() {
          $shiftedMenuItem.css('display', '');
        }, 0);
      }

      var $li = $([
        '<li class="linked" data-fl-exit-app>',
        '<div class="fl-bottom-bar-icon-holder">',
        '<div class="fl-menu-icon">',
        '<i class="fa fa-sign-out"></i>',
        '</div>',
        '<div class="fl-menu-title">',
        '<span>' + T('widgets.menu.bottomBar.actions.exit') + '</span>',
        '</div>',
        '</div>',
        '</li>'
      ].join(''));

      $li.on('click', function onExitClick() {
        Fliplet.Navigate.exitApp();
      });
      $menuHolder.find('ul').append($li);
    });

    // Prevent default "Exit" link from being added
    return Promise.reject();
  });

  var activeMenuItem = parseInt(Fliplet.Navigate.query.activeMenuItem, 10);

  // Select active page based on query
  if (!isNaN(activeMenuItem)) {
    $('.fl-bottom-bar-menu-holder')
      .each(function() {
        $(this).find('li')
          .not('[data-show-more]') // Ignore "More" menu items
          .eq(activeMenuItem).addClass('active');
      });
  } else {
    // Select active page based on current page ID
    $('.fl-bottom-bar-menu-holder li[data-page-id="' + Fliplet.Env.get('pageId') + '"]').addClass('active');
  }

  // Show more, when available
  $menuElement.on('click keydown', 'li[data-show-more]', function(event) {
    if (event.type !== 'click' && event.which !== 32 && event.which !== 13) {
      return;
    }

    $menuElement.find('li[data-show-more] ~ li[data-hidden]').toggleClass('hidden');

    var $parent = $(this).parents('.fl-bottom-bar-menu-holder');
    var menuHeight = $parent[0].clientHeight;
    var deviceHeight = window.document.documentElement.clientHeight;

    $parent.toggleClass('expanded');

    // Prevent scrolling content when menu is opened
    $('body.fl-with-bottom-menu.fl-menu-bottom-bar').toggleClass('hide-scroll');

    // Set height depend on device and content height to prevent stretching the menu to full screen
    $parent.height(menuHeight > deviceHeight ? '100%' : 'unset');
  });

  $menuElement.on('click keydown', '.fl-bottom-bar-menu-holder li:not([data-show-more])', function(event) {
    if (event.type !== 'click' && event.which !== 32 && event.which !== 13) {
      return;
    }

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
