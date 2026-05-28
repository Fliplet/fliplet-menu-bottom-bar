var $menuElement = $('[data-name="Bottom icon bar"]');
var menuInstanceId = $menuElement.data('id');

/**
 * Highlights a menu item by its index position
 * @param {number} index - Zero-based index of the menu item to highlight
 */
function highlightItemByIndex(index) {
  $('.fl-bottom-bar-menu-holder')
    .each(function() {
      $(this).find('li')
        .not('[data-show-more]') // Ignore "More" menu items
        .eq(index).addClass('active');
    });
}

/**
 * Attaches keyboard visibility handlers to hide the bottom bar menu when keyboard appears on native devices
 *
 * This function uses the Visual Viewport API to detect when the native keyboard is shown or hidden.
 * When the keyboard is visible, it adds the 'fl-bottom-bar-keyboard-visible' class to the body element,
 * which triggers CSS rules to hide the bottom menu.
 *
 * @returns {void}
 */
function attachKeyboardHandlers() {
  if (!Fliplet.Env.is('native') || !window.visualViewport) {
    return;
  }

  var $body = $('body');
  var isKeyboardVisible = false;
  var initialViewportHeight = window.visualViewport.height;

  /**
   * Handles viewport resize and scroll events to detect keyboard visibility
   * @private
   */
  var viewportHandler = function() {
    var viewportHeight = window.visualViewport.height;

    // If viewport height is significantly smaller than initial height, keyboard is visible
    // Threshold of 150px accounts for device variations
    var heightDifference = initialViewportHeight - viewportHeight;
    var keyboardVisible = heightDifference > 150;

    if (keyboardVisible && !isKeyboardVisible) {
      isKeyboardVisible = true;
      $body.addClass('fl-bottom-bar-keyboard-visible');
    } else if (!keyboardVisible && isKeyboardVisible) {
      isKeyboardVisible = false;
      $body.removeClass('fl-bottom-bar-keyboard-visible');
      // Update initial height when keyboard is fully hidden
      initialViewportHeight = viewportHeight;
    }
  };

  window.visualViewport.addEventListener('resize', viewportHandler);
  window.visualViewport.addEventListener('scroll', viewportHandler);
}

function init() {
  $('body').addClass('fl-menu-bottom-bar');

  // Remove stale master page references that should have been replaced by production pages
  var appPages = Fliplet.Env.get('appPages') || [];
  var masterPageIds = {};

  appPages.forEach(function(p) {
    if (p.masterPageId) {
      masterPageIds[p.masterPageId] = true;
    }
  });

  Fliplet().then(function() {
    $menuElement.find('.fl-bottom-bar-menu-holder li[data-page-id]').each(function() {
      var pageId = $(this).attr('data-page-id');

      if (!pageId || !masterPageIds[pageId]) {
        return;
      }

      // Cleanup only applies to items that actually navigate to that pageId as a screen view.
      // Skip non-screen actions whose pageId is incidental (PS-1939, PS-1966)
      var nav = {};

      try {
        nav = JSON.parse($(this).attr('data-fl-navigate') || '{}');
      } catch (e) {
        // Malformed JSON — fall through and remove
      }

      var nonScreenActions = ['logout', 'exit-app', 'url', 'popup', 'about-overlay'];

      if (nonScreenActions.indexOf(nav.action) !== -1) {
        return;
      }

      $(this).remove();
    });
  });

  attachKeyboardHandlers();

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
    highlightItemByIndex(activeMenuItem);
  } else {
    // Select active page based on current page ID (excluding any items that use the activeMenuItem parameter)
    $('.fl-bottom-bar-menu-holder li[data-page-id="' + Fliplet.Env.get('pageId') + '"]').not('[data-fl-navigate*="activeMenuItem="]').addClass('active');
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

    var navigate = $(this).data('fl-navigate');
    var index = Fliplet.Navigate.parseQuery(navigate.query).activeMenuItem;

    if (typeof index !== 'undefined') {
      highlightItemByIndex(index);

      return;
    }

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

Fliplet().then(function() {
  $menuElement.translate();
});
