widget.on('beforewidgetindashboardmenu', (widget, event) => {
  const hiddenDownloadOptions = ['csv', 'excel']; // image, csv, pdf, excel

  const download = event.items.find((item) => (item.caption === 'Download'));
  const idList = hiddenDownloadOptions.map((title) => (download.items.findIndex(
    (item) => (item.command && item.command.title === `dashboard.widget.commands.${title}.title`))));
  idList.sort().reverse().forEach((idx) => {
    idx > -1 && download.items.splice(idx, 1);
  });
});
