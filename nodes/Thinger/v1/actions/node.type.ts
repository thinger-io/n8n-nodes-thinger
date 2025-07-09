import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	[key: string]: 'get' | 'getMany';
};

export type ThingerType = AllEntities<NodeMap>;
