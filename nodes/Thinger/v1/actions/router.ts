import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

//import * as device from './device/Device.resource';
import * as assets from './assets/Assets.resource';
import * as device from './device/Device.resource';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const resourceType = this.getNodeParameter('resourceType', 0);
	const operation = this.getNodeParameter('operation', 0);

	try {
		if (resourceType === 'device' && operation === 'write') {
			returnData = await device.write.execute.call(this);
		} else if (operation === 'get' || operation === 'getMany') {
			returnData = await assets[operation].execute.call(this);
		} else {
			const assetOperation = await import(`./${resourceType}/${operation}.operation`);
			if (assetOperation && typeof assetOperation.execute === 'function') {
				returnData = await assetOperation.execute.call(this);
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
			}
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
