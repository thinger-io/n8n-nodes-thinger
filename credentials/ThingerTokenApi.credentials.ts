import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ThingerTokenApi implements ICredentialType {
    name = 'thingerTokenApi';
    displayName = 'Thinger.io API';
    documentationUrl = 'https://api.thinger.io/swagger/';
    properties: INodeProperties[] = [
        {
            displayName: 'Thinger.io Host',
            name: 'thingerHost',
            type: 'string',
            default: '$env["THINGER_HOST"]',
            description: 'Your Thinger.io host',
        },
        {
            displayName: 'Auth Token',
            name: 'authToken',
            type: 'string',
            typeOptions: { password: true },
            default: '$env["THINGER_TOKEN_N8N_PLUGIN"]',
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
