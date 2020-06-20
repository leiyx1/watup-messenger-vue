export function desktopNotify(notificationContent) {
  if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function() {
      var notice_ = new Notification("From Watup", { body: notificationContent });
      notice_.click = function() {
        //单击消息提示框，进入浏览器页面
        window.show();
        window.focus();
      };
    });
  }
}
