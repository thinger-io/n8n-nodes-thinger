import type { ILoadOptionsFunctions, INodeListSearchResult, INodeListSearchItems } from 'n8n-workflow';
import { apiRequest } from '../transport';
import { getThingerAssetsEndpoint } from '../helpers/thinger';

/**
 * Queries the Thinger.io API for assets and returns a list of search results.
 * @param this
 * @param filter 
 * @returns 
 */
export async function assetSearch(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {

	let listSearchResult: INodeListSearchResult = {
		results: [],
	};

	const asset = this.getNodeParameter('resource', 0) as string;
	let endpoint = getThingerAssetsEndpoint(asset);
	let elements = await apiRequest.call(this, 'GET', endpoint, {}, { name: filter });

	for (const item of elements) {
		let searchItem: INodeListSearchItems = {
			name: item?.name || item[asset], // Use name if available, otherwise fallback to id
			value: item[asset],
		}
		if ( item.description ) {
			searchItem.description = item.description; // Optional description if available
		}
		listSearchResult.results.push(searchItem);
	}

	return listSearchResult;
}