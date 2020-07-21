const naFilters = ['Is Extension', 'Sales Revenue Country', 'Generating Country'];

widget.on('beforequery', (widget, event) => {
  event.query.metadata.filter((data) => (naFilters.includes(data.jaql.title))).forEach((data) => {
    if (data.jaql.filter.exclude) {
      const excludedMembers = data.jaql.filter.exclude.members;
      const idx = excludedMembers.indexOf('-');
      if (excludedMembers.length > 1 && idx > -1) {
        excludedMembers.splice(idx, 1);
      } else if (data.jaql.filter.filter) {
        data.jaql.filter.filter.members.push('-');
        data.jaql.filter.exclude = null;
        data.jaql.filter.all = true;
      } else {
        data.jaql.filter.exclude = null;
        data.jaql.filter.all = true;
      }
    }
  });
});
