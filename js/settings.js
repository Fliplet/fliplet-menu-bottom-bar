var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};
var appId = Fliplet.Env.get('appId');

console.log('data: ', data);

Fliplet.Widget.onSaveRequest(function() {
  Fliplet.Widget.save({}).then(function() {
    Fliplet.Widget.complete();
  });
});

Fliplet.Widget.onCancelRequest(function() {
  Fliplet.Widget.complete();
});