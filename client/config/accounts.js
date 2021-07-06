AccountsTemplates.configure({
  showLabels: false
});

const email = AccountsTemplates.removeField('email');
const pwd = AccountsTemplates.removeField('password');

AccountsTemplates.addFields([
  {
    _id: 'firstName',
    type: 'text',
    displayName: 'First Name',
    placeholder: 'First Name',
    required: true
  }, {
    _id: 'lastName',
    type: 'text',
    displayName: 'Last Name',
    placeholder: 'Last Name',
    required: true
  },
  email,
  pwd
]);
