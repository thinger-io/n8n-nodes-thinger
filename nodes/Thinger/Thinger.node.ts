import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { ThingerV1 } from './v1/ThingerV1.node';

export class Thinger extends VersionedNodeType {
    constructor() {
        const baseDescription: INodeTypeBaseDescription = {
            displayName: 'Thinger',
            name: 'thinger',
            icon: 'file:thinger.svg',
            group: ['input'],
            description: 'Interact with the Thinger.io API',
            defaultVersion: 1,
        };

        const nodeVersions: IVersionedNodeType['nodeVersions'] = {
            1: new ThingerV1(baseDescription),
        };

        super(nodeVersions, baseDescription);
    }
}