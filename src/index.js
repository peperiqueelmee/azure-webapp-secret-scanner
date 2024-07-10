require('dotenv').config();
const { listSubscriptions } = require('./services/subscriptionService');
const { listWebApps, listWebAppSettings } = require('./services/webAppService');
const { getAccessToken } = require('./auth/auth');
const { vaultName, secretName } = require('./config/envConfig');

const expectedSecretReference = `@Microsoft.KeyVault(VaultName=${vaultName};SecretName=${secretName})`;

async function main() {
  const chalk = (await import('chalk')).default;
  const results = [];

  try {
    const accessToken = await getAccessToken();
    const subscriptions = await listSubscriptions(accessToken);

    for (const sub of subscriptions) {
      console.log(`Subscription: ${sub.name}`);
      const webApps = await listWebApps(sub.id, accessToken);

      for (let i = 0; i < webApps.length; i++) {
        const app = webApps[i];
        console.log(`Analyzing web app settings ${app.name} (${i + 1} of ${webApps.length})...`);

        const settings = await listWebAppSettings(sub.id, app.resourceGroup, app.name, accessToken);
        const filteredSettings = Object.entries(settings).filter(([key, value]) => value === expectedSecretReference);

        if (filteredSettings.length > 0) {
          results.push({
            name: app.name,
            resourceGroup: app.resourceGroup,
            variables: filteredSettings.map(([key]) => key),
          });
        }
      }
    }

    if (results.length === 0) {
      console.log(
        chalk.red.bold(
          `\nNo web apps were found that reference the secret ${chalk.blue.bold(
            secretName
          )} in the vault ${chalk.blue.bold(vaultName)}.\n`
        )
      );
      return;
    }

    console.log(
      chalk.green.bold(
        `\nThe web apps that reference the secret ${chalk.blue.bold(secretName)} in the vault ${chalk.blue.bold(
          vaultName
        )} are:\n`
      )
    );
    results.forEach(result => {
      console.log(
        `Web App: ${chalk.blue.bold(result.name)} in Resource Group: ${chalk.blue.bold(
          result.resourceGroup
        )} with variable(s): ${chalk.blue.bold(result.variables.join(', '))}`
      );
    });
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

main();
