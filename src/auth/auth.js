const axios = require('axios');
const querystring = require('querystring');
const { tenantId, clientId, clientSecret } = require('../config/envConfig');

async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
  const tokenData = querystring.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    resource: 'https://management.azure.com/',
  });

  try {
    console.log('Obtaining access token...');
    const response = await axios.post(tokenUrl, tokenData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { getAccessToken };
