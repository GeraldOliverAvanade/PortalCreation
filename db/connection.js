const { ClientSecretCredential } = require('@azure/identity');
require('dotenv').config();

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

async function getToken() {
  const token = await credential.getToken(`${process.env.DATAVERSE_URL}/.default`);
  return token.token;
}

module.exports = { getToken };
