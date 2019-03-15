function openInNewTab(url) {
  var win = window.open(url, '_blank');
  setTimeout(function(){win.focus()}, 5000);
}
