/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'n8n-workflow';

//import * as device from './device/Device.resource';
import * as assets from './assets/Assets.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Thinger',
	name: 'thinger',
	icon: 'file:thinger.svg',
	group: ['input'],
	version: [1],
	//subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	description: 'Read, update, write and delete data and resources from Thinger.io',
	defaults: {
		name: 'Thinger',
	},
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
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
		/*
		{
			displayName: 'Asset',
			name: 'asset',
			type: 'options',
			noDataExpression: true,
			default: '',
			typeOptions: {
				loadOptionsMethod: 'loadAssets'
			},
		},
		*/
		/*{
			displayName: 'Shit',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Device',
					value: 'device'
				}
			],
			default: 'device'
		},
		 */
		...assets.description,
		//...device.description
	],
};
