import type {
	IDataObject,
	IExecuteFunctions,
	IPollFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	ITriggerFunctions,
} from 'n8n-workflow';

import { getApiUser } from '../helpers/utils';

// eslint-disable-next-line n8n-community-packages/no-restricted-imports
import { WebSocket } from 'ws'; // Import WebSocket from 'ws' package

/**
 * Make an API request to Thinger.io
 */
export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	host?: string,
	option: IDataObject = {},
) {
	query = query || {};

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;

	const credentials = await this.getCredentials(authenticationMethod);
	endpoint = endpoint.replace('{user}', getApiUser(credentials.authToken as string));

	if ( !host  ) {
		const thingerHost = credentials.thingerHost as string;
		host = credentials.useSSL === true ? `https://${thingerHost}` : `http://${thingerHost}`;
	}

	const options: IRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		uri: `${host}${endpoint}`,
		useQuerystring: false,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	return await this.helpers.requestWithAuthentication.call(this, authenticationMethod, options);
}

/**
 * Make an API request to paginated Thinger.io endpoint
 * and return all results
 */
export async function apiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
) {

	if (query === undefined) {
		query = {};
	}
	query.count = 100;
	query.index = 0;

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await apiRequest.call(this, method, endpoint, body, query);
		returnData.push.apply(returnData, responseData as IDataObject[]);

		query.index += responseData.length;
	} while (responseData.length === query.count);

	return returnData;
}

/**
 * Open a WebSocket connection to Thinger.io
 */
export async function createWebSocket(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions | ITriggerFunctions,
	endpoint: string,
	host?: string,
): Promise<WebSocket> {

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;


	const credentials = await this.getCredentials(authenticationMethod);
	endpoint = endpoint.replace('{user}', getApiUser(credentials.authToken as string));

	if ( !host  ) {
		const thingerHost = credentials.thingerHost as string;
		host = credentials.useSSL === true ? `wss://${thingerHost}` : `ws://${thingerHost}`;
	}

	const headers = {
		Authorization: `Bearer ${credentials.authToken}`,
	}

	const ws = new WebSocket(`${host}${endpoint}`, {
		headers: headers
	});

	return ws;
}
