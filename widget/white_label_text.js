const whiteLabels = ['BTL', 'ATL'];

widget.on('processresult', (widget, event) => {
  event.result.series.filter((series) => (whiteLabels.includes(series.name))).forEach((series) => {
    series.data.forEach((data) => {
      data.dataLabels = {
        enabled: true,
        style: { color: '#FFFFFF' },
      };
    });
  });
});
