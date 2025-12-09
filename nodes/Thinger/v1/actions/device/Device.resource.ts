import type { INodeProperties } from 'n8n-workflow';

import * as write from './write.operation';

export { write };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resourceType: ['device'],
			},
		},
		options: [
			{
				name: 'Write',
				value: 'write',
				description: 'Write data to a device resource',
				action: 'Write to device',
			},
		],
		default: 'write',
	},
	...write.description,
];
