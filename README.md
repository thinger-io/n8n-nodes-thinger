# n8n-nodes-thinger

This is an n8n community node. It lets you use Thinger.io API in your n8n workflows.

<p align="center">
  <img src='https://s3.eu-west-1.amazonaws.com/thinger.io.files/plugins/n8n/img/n8n-thinger-node.png' alt="Thinger n8n node">
</p>

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This community node allows to execute `get single` and `get many` for all the assets in Thinger.io. As well it may allow additional operations over certain assets, listed below.

 -Bucket Read

There is also a Trigger node that subscribes to Thinger.io events.

### For developers

Operations are retrieved dinamycally. To add a new operation to an asset, create the asset folder inside actions and the operation file (see `actions/bucket/read.operation.ts`). Once created add ty he description in the `Asset.resource.ts` file.
Afterwards, the operation should be available to execute for said asset.

## Credentials

For authenticating with Thinger.io API, an Access Token has to be created. More information on how to create an Access Token can be found [here](https://docs.thinger.io/features/access-tokens).

## Compatibility

This n8n community node is compatible with the latest versions of n8n.

## Usage

Usage is rather simple. First of all select either the Thinger node or the Thinger Trigger node, based on the operations desired.

All input configuration allows expressions.

<p align="center">
  <img src='https://s3.eu-west-1.amazonaws.com/thinger.io.files/plugins/n8n/img/n8n-thinger-node-configuration.png' alt="Thinger n8n node">
</p>


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Thinger.io community](https://community.thinger.io)
* [Thinger.io discord](https://discord.com/invite/xAc24hdWZE)

## Version history

### V1

First and last version of the node
