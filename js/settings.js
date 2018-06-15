var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};
var appId = Fliplet.Env.get('appId');

console.log('data: ', data);

var topMenu = Fliplet.App.Settings.get('topMenu') || {
  id: 'pages'
}
console.log('top menu: ', topMenu);

Fliplet.DataSources.get({
  type: 'menu',
  appId: appId,
}).then(function(menus) {
  console.log('menus: ', menus);

  if (topMenu.id === 'pages') {
    Fliplet.Pages.get()
      .then(function(pages) {
        console.log('all pages: ', pages);
      });
  } else {
    var selectedMenu = _.find(menus, function(menu) {
      return parseInt(menu.id, 10) === parseInt(topMenu.id, 10);
    });

    console.log('selected menu: ', selectedMenu);

    Fliplet.DataSources.connect(selectedMenu.id)
      .then(function(connection) {
        return connection.find({
          order: [
            ['order', 'ASC']
          ]
        });
      })
      .then(function(pages) {
        if (!pages || !pages.length) {
          return;
        }

        console.log('selected menu pages:', pages)
      });
  }
});

Fliplet.Widget.onSaveRequest(function() {
  Fliplet.Widget.save({
    icons: [
      {
        icon: 'newspaper-o'
      },
      {
        icon: 'address-book-o'
      },
      {
        icon: 'eercast'
      },
      {
        icon: 'bandcamp'
      },
      {
        icon: 'envelope-open'
      }
    ]
  }).then(function() {
    Fliplet.Widget.complete();
  });
});

Fliplet.Widget.onCancelRequest(function() {
  Fliplet.Widget.complete();
});