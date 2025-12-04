import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
    Icon
} from 'n8n-workflow';

export class ThingerTokenApi implements ICredentialType {
    name = 'thingerTokenApi';
    displayName = 'Thinger.io API';
    documentationUrl = 'https://console.thinger.io/swagger';
    icon: Icon = 'file:../icons/thinger.svg';
    properties: INodeProperties[] = [
        {
            displayName: 'Thinger.io Host',
            name: 'thingerHost',
            type: 'string',
            default: '',
            description: 'Your Thinger.io host (e.g., "console.thinger.io" or your custom domain)',
        },
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
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.authToken}}'
            }
        },
    };

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.thingerHost}}',
			url: '/v1/users'
		},
	};

}
