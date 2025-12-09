import type { INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import * as assets from './assets/Assets.resource';
import * as device from './device/Device.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Thinger',
	name: 'thinger',
	icon: 'file:thinger.svg',
	group: ['input'],
	version: [1],
	subtitle: '={{ $parameter["operation"] + ": " + $parameter["resourceType"] }}',
	description: 'Read, update, write and delete data and resources from Thinger.io',
	defaults: {
		name: 'Thinger',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	credentials: [
		{
			name: 'thingerTokenApi',
			required: true,
			displayOptions: {
				show: {
					authentication: ['thingerTokenApi'],
				},
			},
		},
	],
	properties: [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Access Token',
					value: 'thingerTokenApi',
				},
			],
			default: 'thingerTokenApi',
		},
		{
			displayName: 'Resource Type',
			name: 'resourceType',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Server Assets',
					value: 'assets',
				},
				{
					name: 'Device',
					value: 'device',
				},
			],
			default: 'assets',
		},
		...assets.description,
		...device.description,
	],
};
