import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
	ICredentialDataDecryptedObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class ThingerTokenApi implements ICredentialType {
	name = 'thingerTokenApi';
	displayName = 'Thinger.io API';
	documentationUrl = 'https://console.thinger.io/swagger';
	icon: Icon = 'file:../icons/thinger.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Bearer token for authenticating with the Thinger.io API',
		},
		{
			displayName: 'SSL',
			name: 'useSSL',
			type: 'boolean',
			default: true,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const authToken = credentials.authToken as string;
		const useSSL = credentials.useSSL as boolean;

		let serverHost = 'unknown';
		try {
			const parts = authToken.split('.');
			if (parts.length === 3) {
				const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
				serverHost = payload.svr || serverHost;
			}
		} catch (error) {
			console.error('Failed to extract host from token:', error);
		}

		const protocol = useSSL ? 'https' : 'http';

		if (!requestOptions.baseURL) {
			requestOptions.baseURL = `${protocol}://${serverHost}`;
		}

		requestOptions.headers = requestOptions.headers || {};
		requestOptions.headers['Authorization'] = `Bearer ${authToken}`;
		requestOptions.headers['Accept'] = 'application/json';

		return requestOptions;
	}

	// Test
	test: ICredentialTestRequest = {
		request: {
			url: '/v1/users',
			method: 'GET',
		},
	};
}
