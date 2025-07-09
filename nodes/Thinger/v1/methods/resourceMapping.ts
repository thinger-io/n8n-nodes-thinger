import type {
  //IDataObject,
  ILoadOptionsFunctions,
  ResourceMapperField,
  ResourceMapperFields,
} from 'n8n-workflow';

import { apiRequest } from "../transport";

/**
 * Retrieves the available filters for a specific event in Thinger.io.
 * @param this 
 * @returns 
 */
export async function getEventsFilter(
  this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {

	const event = this.getNodeParameter('event', undefined, {
		extractValue: true,
	}) as string;

	const response = await apiRequest.call(this, 'GET', '/v1/server/events');

  const filters: ResourceMapperField[] = [];

  const selectedEvent = response.find((e: { event: string }) => e.event === event);

  for ( const filter of selectedEvent.filters ) {

    if ( filter.hasOwnProperty('hints') ) {
      filters.push({
        id: filter.field,
        displayName: filter.field,
        required: false,
        type: 'options',
        options: filter.hints.map((hint: string) => ({
          name: hint,
          value: hint,
        })),
        canBeUsedToMatch: false,
        defaultMatch: false,
        display: true,
    });

    } else {

      filters.push({
        id: filter.field,
        displayName: filter.field,
        required: false,
        type: 'string',
        canBeUsedToMatch: false,
        defaultMatch: false,
        display: true,
      });
    }

  }

  return { fields: filters };
}