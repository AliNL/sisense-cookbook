const columnsToHide = ['opportunity_id_hide'];

widget.on('processresult', (widget, event) => {
  event.result.metadata.filter((data) => (columnsToHide.includes(data.jaql.title))).forEach((data) => {
    data.format = {
      width: 0,
    };
  });
});

let indexes = null;

widget.on('ready', (widget, event) => {
  const scope = $(`widget[widgetid="${widget.oid}"], div.prism-widget-preview`);
  indexes = indexes || columnsToHide.map((column) => (scope.find(`td:contains(${column})`)[0].cellIndex));
  scope.find('.multi-grid__bottom-part tr').each((_, row) => {
    indexes.forEach((idx) => {
      const elementToHide = $(row).find(`.table-grid__cell--col-${idx} .table-grid__content__inner`)[0];
      if (elementToHide) {
        elementToHide.style = 'opacity: 0';
      }
    });
  });
  scope.find(indexes.map((idx) => (`.table-grid__cell--row-0.table-grid__cell--col-${idx}`)).join(', ')).
    each((_, element) => {
      element.innerHTML = '';
    });
});
