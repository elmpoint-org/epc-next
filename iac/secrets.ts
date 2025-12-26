export const SecretMap = {
  SecretBrevoAPIKey: new sst.Secret('SecretBrevoAPIKey'),
  SecretPasswordlessSecret: new sst.Secret('SecretPasswordlessSecret'),
  SecretResendAPIKey: new sst.Secret('SecretResendAPIKey'),
  SecretUserAuthSecret: new sst.Secret('SecretUserAuthSecret'),
  SecretDomainARN: new sst.Secret('SecretDomainARN'),
  SecretDomainARNxyz: new sst.Secret('SecretDomainARxyz'),
};

export const secrets = Object.values(SecretMap);
