Template.registerHelper('formatMoney', value => accounting.formatMoney(value));
Template.registerHelper('formatPercentage', value => value.toFixed(2) + '%');
Template.registerHelper('propertyDetail', detail => detail || '?');
