import type { INodeExecutionData, INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'Device',
		name: 'device',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'my-device',
		description: 'The device ID to write to',
	},
	{
		displayName: 'Resource',
		name: 'deviceResource',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'led_control',
		description: 'The device resource/endpoint to write to',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		default: '{\n  "value": 1\n}',
		required: true,
		description: 'JSON body to send to the device resource',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
	},
];

const displayOptions = {
	show: {
		resourceType: ['device'],
		operation: ['write'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const device = this.getNodeParameter('device', i) as string;
			const deviceResource = this.getNodeParameter('deviceResource', i) as string;
			const bodyRaw = this.getNodeParameter('body', i) as string;

			// Parse JSON body
			let body;
			try {
				body = JSON.parse(bodyRaw);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON in body parameter: ${error.message}`,
					{ itemIndex: i }
				);
			}

			const endpoint = `/v3/users/{user}/devices/${device}/resources/${deviceResource}`;
			const result = await apiRequest.call(this, 'POST', endpoint, body);

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
