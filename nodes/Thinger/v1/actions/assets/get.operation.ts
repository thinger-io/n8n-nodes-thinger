import type { INodeExecutionData, INodeProperties, IExecuteFunctions } from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';
import { apiRequest } from '../../transport';
import { getThingerAssetsEndpoint } from '../../helpers/thinger';

const properties: INodeProperties[] = [
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Whether to return all results or only up to a given limit',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'assetSearch',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9_-]{1,32}',
							errorMessage: 'Not a valid ID',
						},
					},
				],
				placeholder: 'shellyem-C45BBE6B6902',
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const asset = this.getNodeParameter('asset', 0) as { mode: string; value: string };

	const endpoint = getThingerAssetsEndpoint(this.getNodeParameter('resource', 0) as string);

	let result = await apiRequest.call(this, 'GET', `${endpoint}/${asset.value}`);

	return this.helpers.returnJsonArray(result);
}
