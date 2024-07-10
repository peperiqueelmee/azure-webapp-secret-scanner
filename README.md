# Azure WebApp Secret Scanner

## Overview

This repository contains a Node.js application designed to scan Azure Web Apps for specific KeyVault secret references. It helps identify web apps that reference specific secrets, such as database passwords, API keys, or other sensitive information. This tool is particularly useful for scenarios like password rotations and secret updates, ensuring all web apps are correctly referencing the updated secrets.

## Prerequisites

Ensure you have the following before you begin:
- Node.js (version 18 or higher)
- Docker (if you plan to use the Docker image)
- An Azure subscription with necessary permissions

## Permissions Required

The application needs the following permissions in Azure subscriptions:
* Read: To list the subscriptions and web apps.
* Website Contributor: To read the environment variables of the web apps.

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
TENANT_ID=<your_tenant_id>
CLIENT_ID=<your_client_id>
CLIENT_SECRET=<your_client_secret>
VAULT_NAME=<your_vault_name>
SECRET_NAME=<your_secret_name>
```

- `TENANT_ID`: Your Microsoft Entra ID tenant ID.
- `CLIENT_ID`: The client ID of the application registered in Microsoft Entra ID.
- `CLIENT_SECRET`: The client secret of the application registered in Microsoft Entra ID.
- `VAULT_NAME`: The name of the KeyVault.
- `SECRET_NAME`: The name of the secret to search for.

## How to Use

### Running Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/peperiquelmee/azure-webapp-secret-scanner.git
   cd azure-webapp-secret-scanner
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables as described above.

4. Run the application:
   ```sh
   npm start
   ```

### Running with Docker

1. Build the Docker image:
   ```sh
   docker build -t azure-webapp-secret-scanner .
   ```

2. Run the Docker container:
   ```sh
   docker run -e TENANT_ID=<your_tenant_id> -e CLIENT_ID=<your_client_id> -e CLIENT_SECRET=<your_client_secret> -e VAULT_NAME=<your_vault_name> -e SECRET_NAME=<your_secret_name> azure-webapp-secret-scanner
   ```

## Docker Hub

You can find the Docker image on Docker Hub:
[https://hub.docker.com/repository/docker/peperiquelmee/azure-webapp-secret-scanner/general](https://hub.docker.com/repository/docker/peperiquelmee/azure-webapp-secret-scanner/general)