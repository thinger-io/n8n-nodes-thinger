import type { INodeType, INodeTypeBaseDescription, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';

import { router } from './actions/router';
import { versionDescription } from './actions/versionDescription';
import { loadOptions, listSearch } from './methods';

export class ThingerV1 implements INodeType {
    description: INodeTypeDescription;

    constructor(baseDescription: INodeTypeBaseDescription) {
      this.description = {
          ...baseDescription,
          ...versionDescription,
          usableAsTool: true,
      };
    }

    methods = {
      listSearch,
      loadOptions,
    };

    async execute(this: IExecuteFunctions) {

      return await router.call(this);
    }

}
