import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

//import * as device from './device/Device.resource';
import * as assets from './assets/Assets.resource';
import type { ThingerType } from './node.type';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const resource: string = this.getNodeParameter('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const thingerNodeData = {
		resource,
		operation,
	} as ThingerType;

	try {
		switch (thingerNodeData.operation) {
			case 'get':
			case 'getMany':
				// Handle 'get' and 'getMany' operations
				returnData = await assets[thingerNodeData.operation].execute.call(this);
				break;
			default:
				// Handle other operations
				const assetOperation = await import(`./${thingerNodeData.resource}/${thingerNodeData.operation}.operation`);
				if ( !(assetOperation) || typeof assetOperation.execute === 'function' ) {
					returnData = await assetOperation.execute.call(this);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`The operation "${operation}" is not supported!`,
					);
				}
				break;
		}
	} catch (error) {
		if (
			error.description &&
			(error.description as string).includes('cannot accept the provided value')
		) {
			error.description = `${error.description}. Consider using 'Typecast' option`;
		}
		throw error;
	}

	return [returnData];
}
