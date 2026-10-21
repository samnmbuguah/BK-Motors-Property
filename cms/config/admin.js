module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bkmotors_admin_jwt_secret_token_12345'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'bkmotors_api_token_salt_67890'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'bkmotors_transfer_token_salt_abcde'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
