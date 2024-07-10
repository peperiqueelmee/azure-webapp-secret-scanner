const axios = require('axios');
const { webAppApiVersion } = require('../config/apiConfig');

async function listWebApps(subscriptionId, accessToken) {
  const baseUrl = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Web/sites?api-version=${webAppApiVersion}`;

  let webApps = [];
  let url = baseUrl;

  try {
    console.log('Fetching web apps...');
    while (url) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      webApps = webApps.concat(
        response.data.value.map(app => ({
          name: app.properties.name,
          resourceGroup: app.properties.resourceGroup,
        }))
      );

      url = response.data.nextLink || null;
    }

    return webApps;
  } catch (error) {
    console.error(
      `Error listing web apps for subscription ${subscriptionId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function listWebAppSettings(subscriptionId, resourceGroupName, webAppName, accessToken) {
  const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Web/sites/${webAppName}/config/appsettings/list?api-version=${webAppApiVersion}`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.properties;
  } catch (error) {
    console.error(
      `Error listing settings for web app ${webAppName} in resource group ${resourceGroupName}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { listWebApps, listWebAppSettings };
