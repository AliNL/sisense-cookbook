const host = 'https://uat.sales-funnel.thoughtworks.net';
const nameAndIdColumns = [
  ['Account Name', 'account_id_hide', 'account'],
  ['Opportunity Name', 'opportunity_id_hide', 'opportunity'],
];

widget.on('processresult', (widget, event) => {
  const idColumns = nameAndIdColumns.map((columns) => (columns[1]));
  event.result.metadata.filter((data) => (idColumns.includes(data.jaql.title))).forEach((data) => {
    data.format = {
      width: 0,
    };
  });
});

let indexes = null;

widget.on('ready', (widget) => {
  const scope = $(`widget[widgetid="${widget.oid}"], div.prism-widget-preview`);
  indexes = indexes || nameAndIdColumns.map(([name, id, type]) => ([
    scope.find(`td:contains(${name})`)[0].cellIndex,
    scope.find(`td:contains(${id})`)[0].cellIndex,
    type,
  ]));
  scope.find('.multi-grid__bottom-part tr').each((_, row) => {
    indexes.forEach(([nameIdx, idIdx, type]) => {
      const nameElement = $(row).find(`.table-grid__cell--col-${nameIdx} .table-grid__content__inner`)[0];
      const idElement = $(row).find(`.table-grid__cell--col-${idIdx} .table-grid__content__inner`)[0];
      if (nameElement && idElement) {
        nameElement.innerHTML = `<a href="${host}/${type}-details/${idElement.innerText}" target="_blank">${nameElement.innerText}</a>`;
        idElement.style = 'opacity: 0';
      }
    });
  });
  scope.find(indexes.map((idx) => (`.table-grid__cell--row-0.table-grid__cell--col-${idx[1]}`)).join(', ')).
    each((_, element) => {
      element.innerHTML = '';
    });
});
