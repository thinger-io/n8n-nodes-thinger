import type { INodeTypeDescription } from 'n8n-workflow';

//import * as device from './device/Device.resource';
import * as assets from './assets/Assets.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Thinger',
	name: 'thinger',
	icon: 'file:../../../icons/thinger.svg',
	group: ['input'],
	version: [1],
	//subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	description: 'Read, update, write and delete data and resources from Thinger.io',
	defaults: {
		name: 'Thinger',
	},
	inputs: ['main'],
	outputs: ['main'],
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
		...assets.description,
	],
};
