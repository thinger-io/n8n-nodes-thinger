import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	assets: 'get' | 'getMany';
	device: 'write';
};

export type ThingerType = AllEntities<NodeMap>;
