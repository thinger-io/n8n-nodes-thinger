import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
} from 'n8n-workflow';

import { getApiHost, getApiUser } from '../helpers/utils';

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
		const thingerHost = getApiHost(credentials.authToken as string);
		host = credentials.useSSL === true ? `https://${thingerHost}` : `http://${thingerHost}`;
	}

	const options: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs: query,
		baseURL: host,
		url: endpoint,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	return await this.helpers.httpRequestWithAuthentication.call(
		this,
		authenticationMethod,
		options,
	);
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
