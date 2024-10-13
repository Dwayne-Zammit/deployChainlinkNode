# Chainlink Node Deployment and Monitoring Resources

This repository contains resources for deploying a Chainlink node and creating monitoring solutions using Grafana and Prometheus. We utilize GitHub Actions workflows to execute Ansible playbooks on a server, using a username and password for authentication.

## Overview

The primary aim of this project is to set up a Chainlink node and monitor its performance using Grafana and Prometheus. The following components are deployed through Ansible playbooks:

- **setUpChainlinkNode.yml**: Installs the Chainlink software in a Docker container and connects it to the Sepolia blockchain.
- **installNodeExporter.yml**: Deploys the Node Exporter to collect system metrics.
- **installPrometheus.yml**: Sets up Prometheus to scrape metrics from the Node Exporter and create alerts for CPU and memory usage.
- **installGrafana.yml**: Installs Grafana as a service and configures it to visualize the metrics collected by Prometheus.

## Secrets Management

To run the playbooks, the following variables are requested as GitHub Secrets:

- `ALCHEMY_APP_API_KEY`: Your Alchemy API key.
- `CHAINLINK_KEYSTORE_PASSWORD`: Password for the Chainlink keystore.
- `GRAFANA_ADMIN_PASSWORD`: Password for the Grafana admin user.
- `GRAFANA_ADMIN_USER`: Username for the Grafana admin.
- `POSTGRES_PASSWORD`: Password for the PostgreSQL database.
- `SERVER_PASSWORD`: Password for the server where the node is deployed.
- `SERVER_USER`: Username for the server where the node is deployed.

## Playbooks

The following Ansible playbooks are included in this repository:

- **installGrafana.yml** - Sets up Grafana.
- **installNodeExporter.yml** - Installs Node Exporter.
- **installPrometheus.yml** - Installs Prometheus and configures alerts.
- **setUpChainlinkNode.yml** - Deploys the Chainlink node.

## Monitoring Setup

Prometheus Installation and Alert Configuration

The Prometheus monitoring solution is seamlessly installed through an Ansible playbook. Within the same playbook, we are configuring two alerts to monitor system performance: one for CPU usage and another for memory utilization. These alerts are designed to trigger notifications whenever the usage exceeds a critical threshold of 85%, ensuring that the system is not out of resources.

Grafana

In a complementary Grafana playbook, we create a Grafana data source via API connected to Prometheus Database. This playbook is configured to check for the existence of the data source and creates it if it does not already exist.

### Importing Dashboards

You can import the following dashboard from the Grafana Marketplace to visualize metrics collected by the Node Exporter:

- [Node Exporter Full Dashboard](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)

## How It Works

1. **Node Exporter**: Exposes metrics about the server's performance.
2. **Prometheus**: Collects the metrics exposed by the Node Exporter and triggers alerts based on predefined thresholds.
3. **Grafana**: Visualizes the collected metrics and displays them in a user-friendly dashboard.
