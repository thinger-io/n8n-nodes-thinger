import {ILoadOptionsFunctions, INodePropertyOptions} from "n8n-workflow";

import { apiRequest } from "../transport";

import { sortObjectArray } from "../helpers/utils";

const path = require("path");
const fs = require("fs");

/**
 * Load options for assets: (Ex. device, buckets, users, domains, etc.)
 * @returns {Promise<INodePropertyOptions[]>}
 */
export async function loadAssets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {

	const response = await apiRequest.call(this, 'GET', '/v1/server/assets');

	const sortedResponse = sortObjectArray(response, 'asset');

	const result: INodePropertyOptions[] = [];

	for (const asset of sortedResponse) {
		result.push({
			name: asset.asset,
			value: asset.asset,
			action: asset.asset
		});
	}

	return result;

}

/**
 * Loads the operations available for a specific asset.
 * @param this 
 * @returns 
 */
export async function loadAssetOperations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const asset = this.getNodeParameter('resource', undefined, {
		extractValue: true,
	}) as string;

	if (!asset) {
		return [{ name: 'Select an Asset First', value: '' }];
	}

	const operationsPath = path.join(__dirname, '..', 'actions', asset);
	let options: INodePropertyOptions[] = [];

	try {
		const files = fs.readdirSync(operationsPath);

		options = files
			.filter((file: string) => file.endsWith('.operation.ts') || file.endsWith('.operation.js'))
			.map((file: string) => {
				const opName = file.replace('.operation.ts', '').replace('.operation.js', '');
				return {
					name: opName.replace(/(^\w)/, m => m.toUpperCase()),
					value: opName,
					description: `Run the "${opName}" operation on ${asset}`,
					action: `Run the "${opName}" operation on ${asset}`,
				};
			});
	} catch (err) {
		console.debug(`No additional operations found for asset "${asset}"`);
	}

	// Append get and get many operations if not already included
	if (!options.some(option => option.value === 'getMany')) {
		options.push({
			name: `Get Many ${asset}s`,
			value: 'getMany',
			description: `Get many ${asset}s`,
			action: `Get Many ${asset}s`,
		});
	}
	if (!options.some(option => option.value === 'get')) {
		options.push({
			name: `Get a single ${asset}`,
			value: 'get',
			description: `Get a single ${asset}`,
			action: `Get a single ${asset}`,
		});
	}

	return options.length > 0
		? options
		: [
			{
				name: `No valid operations for "${asset}"`,
				value: '',
			},
		];
}

/**
 * Loads the events available for a specific asset.
 * @param this 
 * @returns 
 */
export async function loadAssetEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const asset = this.getNodeParameter('resource', undefined, {
		extractValue: true,
	}) as string;

	if (!asset) {
		return [{ name: 'Select an Asset First', value: '' }];
	}

	const response = await apiRequest.call(this, 'GET', '/v1/server/events');

	const sortedResponse = sortObjectArray(response, 'event');

	const result: INodePropertyOptions[] = [];

	for (const event of sortedResponse) {
		if ( event.event.startsWith(asset) ) { 
			result.push({
				name: event.event,
				value: event.event,
				action: event.event
				//description: `Asset ID: ${asset.asset}`,
			});
		}
	}

	return result;
}

/*export async function loadTimezones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const timezones = Intl.supportedValuesOf('timeZone');
	const options: INodePropertyOptions[] = timezones.map(tz => ({
		name: tz,
		value: tz,
	}));

	return options;
}
*/
