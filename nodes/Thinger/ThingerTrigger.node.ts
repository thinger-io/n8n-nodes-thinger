import type { INodeType, ITriggerFunctions, ITriggerResponse, ResourceMapperValue } from 'n8n-workflow';
import { NodeConnectionType, type INodeTypeDescription } from 'n8n-workflow';

import { loadOptions, resourceMapping } from './v1/methods';
import { createWebSocket } from './v1/transport';

export class ThingerTrigger implements INodeType {
	methods = {
		loadOptions,
        resourceMapping,
	};
	description: INodeTypeDescription = {
		displayName: 'Thinger Trigger',
		name: 'thingerTrigger',
		icon: 'file:thinger.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a Thinger events occurs',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'Thinger Trigger',
		},
		triggerPanel: {
			header: '',
		},
		credentials: [
			{
				name: 'thingerTokenApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['thingerTokenApi'],
					},
				},
			},
		],
		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'thingerTokenApi',
					},
				],
				default: 'thingerTokenApi',
			},
			{
				displayName: 'Resource Name or ID',
				name: 'resource',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				noDataExpression: true,
				default: '',
				typeOptions: {
					loadOptionsMethod: 'loadAssets',
				},
			},
			{ // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Event',
				name: 'event',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				noDataExpression: true,
				typeOptions: {
					loadOptionsMethod: 'loadAssetEvents',
					loadOptionsDependsOn: ['resource'],
				},
				default: '',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'resourceMapper',
				noDataExpression: true,
				default: {
					mappingMode: 'defineBelow',
					value: null,
				},
				typeOptions: {
					loadOptionsDependsOn: ['event'],
					resourceMapper: {
						resourceMapperMethod: 'getEventsFilter',
						mode: 'add',
						fieldWords: {
							singular: 'filter',
							plural: 'filters',
						},
						addAllFields: true,
						multiKeyMatch: false,
            supportAutoMap: false,
					},
				},
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {

		const event = this.getNodeParameter('event', 0) as string;
		const filters = (this.getNodeParameter('filters', 0, {}) as ResourceMapperValue).value;

		let isConfirmClose = false;

		const endpoint = '/v1/users/{user}/events';

		let socket: any = null;

		const run = async (reconnectTimes = 0) => {
			socket = await createWebSocket.call(this, endpoint);

			socket.on('message', (data: string) => {
				const resultData = {
					event: 'message',
					ws: socket,
					data: JSON.parse(data),
				};

				this.emit([this.helpers.returnJsonArray(resultData)]);
			});

			socket.on('open', () => {
				const resultData = {
					event: 'open',
					ws: socket,
				};

				let subscription: { [key: string]: string } = {};
				for (let key in filters) {
					const value = filters[key];
					if (value !== "any" && value !== "" && value !== null) {
						subscription[key] = String(value);
					}
				}
				subscription.event = event; // subscribe to the specific event

				socket.send(JSON.stringify(subscription));

				this.emit([this.helpers.returnJsonArray(resultData)]);
			});

			socket.on('error', (error: any) => {
				this.emitError(new Error('Connection got error: ' + error.message));
			});

			socket.on('close', async (code: number, reason: string) => {
				const resultData = {
					event: 'close',
					code: code,
				};
				this.emit([this.helpers.returnJsonArray(resultData)]);

				if (isConfirmClose) {
					console.log('confirm close');
					return;
				}

                // handle reconnection
				await run(reconnectTimes + 1);
			});
		};

		const closeFunction = async () => {
			if (socket) {
				isConfirmClose = true;
				console.log('closeFunction socket');
				socket.terminate();
			}
		};

		await run();

		return {
			closeFunction: closeFunction,
		};
	}
}
