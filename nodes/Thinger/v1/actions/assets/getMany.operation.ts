import type {
  INodeExecutionData,
  INodeProperties,
	IExecuteFunctions
} from 'n8n-workflow';

import { updateDisplayOptions } from "n8n-workflow";
import { apiRequestAllItems } from "../../transport";
import { getThingerAssetsEndpoint } from '../../helpers/thinger';

const properties: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter the assets by ID or name'
			}
		]
	}
];

const displayOptions = {
    show: {
        operation: ['getMany'],
    },
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {

	const filters = this.getNodeParameter('filters', 0);

	const asset = this.getNodeParameter('resource', 0) as string;

	const endpoint = getThingerAssetsEndpoint(asset);

  let result = await apiRequestAllItems.call(this, 'GET', endpoint, {}, filters);

  return this.helpers.returnJsonArray(result);

}
