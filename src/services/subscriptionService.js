const axios = require('axios');
const { subscriptionApiVersion } = require('../config/apiConfig');

async function listSubscriptions(accessToken) {
  const url = `https://management.azure.com/subscriptions?api-version=${subscriptionApiVersion}`;

  try {
    console.log('Fetching subscriptions...');
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.value.map(sub => ({
      id: sub.subscriptionId,
      name: sub.displayName,
    }));
  } catch (error) {
    console.error('Error listing subscriptions:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { listSubscriptions };
