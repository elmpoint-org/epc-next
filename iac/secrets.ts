export const SecretMap = {
  SecretBrevoAPIKey: new sst.Secret('SecretBrevoAPIKey'),
  SecretPasswordlessSecret: new sst.Secret('SecretPasswordlessSecret'),
  SecretResendAPIKey: new sst.Secret('SecretResendAPIKey'),
  SecretUserAuthSecret: new sst.Secret('SecretUserAuthSecret'),
  SecretDomainARN: new sst.Secret('SecretDomainARN'),
};

export const secrets = Object.values(SecretMap);
