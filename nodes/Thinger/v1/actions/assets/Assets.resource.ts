import type { INodeProperties } from 'n8n-workflow';

import * as getMany from './getMany.operation';
import * as get from './get.operation';

import * as bucketRead from '../bucket/read.operation';

export { getMany, get};

export const description: INodeProperties[] = [

	{
		displayName: 'Resource Name or ID',
		name: 'resource',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		noDataExpression: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'loadAssets'
		},
	},
	{
		displayName: 'Operation Name or ID',
		name: 'operation',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		noDataExpression: true,
		typeOptions: {
			loadOptionsMethod: 'loadAssetOperations',
			loadOptionsDependsOn: ['resource'],
		},
		default: '',
	},
	...getMany.description,
	...get.description,
	...bucketRead.description,
];
