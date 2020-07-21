const [regions, currency] = payload.data.region.split(';');

const filters = payload.widget.dashboard.filters;
filters.update([
    {
      jaql: {
        title: 'Sales revenue region',
        dim: '[Dim opportunity.Sales revenue region]',
        filter: {
          all: regions === 'all',
          members: regions !== 'all' ? regions.split(',') : null,
        },
      },
    }, {
      jaql: {
        title: 'Local currency',
        dim: '[Exchange rate.Local currency]',
        filter: {
          members: [currency],
        },
      },
    }, {
      jaql: {
        title: 'Opportunity owner',
        dim: '[Dim opportunity.Opp owner]',
        filter: {
          all: payload.data.owner === 'all',
          members: payload.data.owner === 'me' ? [prism.user.firstName] : null,
        },
      },
    },
  ],
  { refresh: false, save: true },
);
