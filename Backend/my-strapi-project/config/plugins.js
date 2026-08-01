module.exports = {
  'users-permissions': {
    config: {
      provider: 'google',
      register: {
        allowedFields: [
          'username',
          'email',
          'password',
          'firstName',
          'lastName',
          'phoneNumber',
          'address',
          'city',
          'zipCode',
          'gender',
        ],
      },
    },
  },
};
