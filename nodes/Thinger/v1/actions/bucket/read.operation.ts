import type {
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';
import { apiRequestAllItems } from '../../transport';

import { priorDate } from '../../helpers/thinger';

const properties: INodeProperties[] = [
	{
		displayName: 'Bucket',
		name: 'bucket',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'The bucket to read data from',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'assetSearch',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9_-]{1,32}',
							errorMessage: 'Not a valid ID',
						},
					},
				],
				placeholder: 'shelly_em_energy',
			},
		],
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'options',
		default: 'relative',
		description: 'Type of filter to apply by timeframe or items',
		options: [
			{
				name: 'Relative Timeframe',
				value: 'relative',
				description: 'Filter by relative timeframe',
			},
			{
				name: 'Absolute Timeframe',
				value: 'absolute',
				description: 'Filter by absolute timeframe',
			},
			{
				name: 'Last N Items',
				value: 'simple',
				description: 'Filter by last N items',
			},
		],
	},
	// Relative Timeframe fields
	{
		displayName: 'Time Period Sequence',
		name: 'timespanSequence',
		type: 'options',
		options: [
			{ name: 'Latest', value: 'latest' },
			{ name: 'Previous', value: 'previous' },
		],
		default: 'latest',
		description: 'Select the sequence of time period for relative timeframe',
		displayOptions: {
			show: {
				filter: ['relative'],
			},
		},
	},
	{
		displayName: 'Time Period Units',
		name: 'timespanUnits',
		type: 'options',
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{ name: 'Seconds', value: 's' },
			{ name: 'Minutes', value: 'm' },
			{ name: 'Hours', value: 'h' },
			{ name: 'Days', value: 'd' },
			{ name: 'Weeks', value: 'w' },
			{ name: 'Months', value: 'mo' },
			{ name: 'Years', value: 'y' },
		],
		default: 'h',
		description: 'Select the time period for relative timeframe',
		displayOptions: {
			show: {
				filter: ['relative'],
			},
		},
	},
	{
		displayName: 'Time Period Amount',
		name: 'timespanValue',
		type: 'number',
		default: 1,
		description: 'Number of periods (e.g., 2 hours)',
		displayOptions: {
			show: {
				filter: ['relative'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
	},
	// Absolute Timeframe fields
	{
		displayName: 'Start Date',
		name: 'minTs',
		type: 'dateTime',
		default: '',
		description: 'Start date for absolute timeframe',
		displayOptions: {
			show: {
				filter: ['absolute'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'maxTs',
		type: 'dateTime',
		default: '',
		description: 'End date for absolute timeframe',
		displayOptions: {
			show: {
				filter: ['absolute'],
			},
		},
	},
	// absolute and relative common fields
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: -1, //eslint-disable-line n8n-nodes-base/node-param-default-wrong-for-limit
		description: 'Number of registries to return, -1 for all', // eslint-disable-line n8n-nodes-base/node-param-description-wrong-for-limit
		displayOptions: {
			show: {
				filter: ['relative', 'absolute'],
			},
		},
		typeOptions: {
			minValue: -1,
		},
	},
	// Last N Items field
	{
		displayName: 'Number of Items',
		name: 'items',
		type: 'number',
		default: 100,
		description: 'Number of latest items to retrieve',
		displayOptions: {
			show: {
				filter: ['simple'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
	},
	// Other common fields
	{
		displayName: 'Aggregation',
		name: 'aggregation',
		type: 'options',
		description: 'Select the aggregation method for the data',
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{ name: 'None', value: '' },
			{ name: '5 min', value: '5min' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '15 min', value: '15min' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '30 min', value: '30min' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '1 hour', value: '1h' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '3 hours', value: '3h' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '6 hours', value: '6h' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '12 hours', value: '12h' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '1 day', value: '1d' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '1 week', value: '1w' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '1 month', value: '1mo' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '3 months', value: '3mo' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '6 months', value: '6mo' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
			{ name: '1 year', value: '1y' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
		],
		default: '',
	},
	{
		displayName: 'Aggregation Type',
		name: 'aggregationType',
		type: 'options',
		description: 'Select the type of aggregation to apply',
		options: [
			{ name: 'Count', value: 'count' },
			{ name: 'Max', value: 'max' },
			{ name: 'Mean', value: 'mean' },
			{ name: 'Median', value: 'median' },
			{ name: 'Min', value: 'min' },
			{ name: 'Mode', value: 'mode' },
			{ name: 'Spread', value: 'spread' },
			{ name: 'Stddev', value: 'stddev' },
			{ name: 'Sum', value: 'sum' },
		],
		default: 'mean',
		displayOptions: {
			show: {
				aggregation: [
					'5min',
					'15min',
					'30min',
					'1h',
					'3h',
					'6h',
					'12h',
					'1d',
					'1w',
					'1mo',
					'3mo',
					'6mo',
					'1y',
				],
			},
		},
	},
	{
		displayName: 'Transform',
		name: 'transform',
		type: 'options',
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{ name: 'None', value: '' },
			{ name: 'Abs', value: 'abs' },
			{ name: 'Ceil', value: 'ceil' },
			{ name: 'Cummulative Sum', value: 'cummulative_sum' },
			{ name: 'Derivative', value: 'derivative' },
			{ name: 'Difference', value: 'difference' },
			{ name: 'Elapsed', value: 'elapsed' },
			{ name: 'Floor', value: 'floor' },
			{ name: 'Round', value: 'round' },
			{ name: 'Non Negative Derivative', value: 'non_negative_derivative' },
			{ name: 'Non Negative Difference', value: 'non_negative_difference' },
		],
		default: '',
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: 'asc',
	},
	/*{
		displayName: 'Timezone',
		name: 'timezone',
		type: 'options',
		description: 'Select the timezone for the data',
		noDataExpression: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'loadTimezones',
		},
	},
	*/
];

const displayOptions = {
	show: {
		operation: ['read'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const bucket = (this.getNodeParameter('bucket', 0) as { mode: string, value: string }).value;

	const queryParameters = new Map();
	if ( this.getNodeParameter('items' , 0, -1) != -1 ) {
		queryParameters.set('items', this.getNodeParameter('items', 0) as number);
	}
	queryParameters.set('agg', this.getNodeParameter('aggregation', 0) as string);
	queryParameters.set('agg_type', this.getNodeParameter('aggregationType', 0, '') as string);
	queryParameters.set('transform', this.getNodeParameter('transform', 0) as string) ;
	queryParameters.set('sort', this.getNodeParameter('sort', 0) as string);
	//queryParameters.set('tz', msg.timezone || config.timezone);

	// Timeframe filters
	let filter = this.getNodeParameter('filter', 0);
	let isFilterTime = true;
	let isSimpleSorting = false;
	let maxTs;
	let minTs;

	switch (filter) {
		case 'relative':
			let timeframeSeq = this.getNodeParameter('timespanSequence', 0) as string;
			let timeframeValue = this.getNodeParameter('timespanValue', 0) as number;
			let timeframeUnits = this.getNodeParameter('timespanUnits', 0) as string;

			minTs = new Date();
			maxTs = minTs.getTime();

			minTs = priorDate(minTs, timeframeUnits, timeframeValue);

			// If sequence is previous minTs will need to pass again through the filter and maxTs will be previous minTs
			if (timeframeSeq == 'previous') {
				maxTs = minTs.getTime();
				minTs = priorDate(minTs, timeframeUnits, timeframeValue);
			}

			minTs = minTs.getTime();

			break;
		case 'absolute':
			maxTs = new Date(this.getNodeParameter('maxTs', 0) as Date).getTime();
			minTs = new Date(this.getNodeParameter('minTs', 0) as Date).getTime();
			break;
		case 'simple':
			//if selection of last N items, the query will be done as desc and sorted to asc after, otherwise, result would not be last
			if (queryParameters.get('sort') == 'asc') {
				queryParameters.set('sort', 'desc');
				isSimpleSorting = true;
			}
			isFilterTime = false;
			break;
	}

	if (isFilterTime) {
		// Add it to the query parameters
		queryParameters.set('max_ts', maxTs);
		queryParameters.set('min_ts', minTs);
		queryParameters.set('items', this.getNodeParameter('limit', 0));
	}

	// limit < 0 will indicate all items matching the filter
	let limit = queryParameters.get('items');
	if (!limit) {
		limit = -1;
	}
	let result: any[] | IDataObject = [];

	let endpoint = `/v1/users/{user}/buckets/${bucket}/data`;

	let responseLength = 0;
	do {

    // Maximum value of items on the query parameter is 1000
    queryParameters.set('items',limit > 1000 || limit < 0 ? 1000 : limit);

		let response = await apiRequestAllItems.call( this, 'GET', endpoint, {}, Object.fromEntries(queryParameters) );

		result = result.concat(response);

		limit = response.length > 0 ? limit - response.length : 0;

		if (limit != 0 && response.length == 1000) {
			// There is more
			switch (queryParameters.get('sort')) {
				case 'asc':
					if (response[999] && typeof response[999].ts === 'number') {
						queryParameters.set('min_ts', response[999].ts - 1);
					}
					break;
				case 'desc':
					if (response[999] && typeof response[999].ts === 'number') {
						queryParameters.set('max_ts', response[999].ts - 1);
					}
					break;
			}

		}

		responseLength = response.length;

	} while ( limit != 0 && responseLength == 1000 );

	if (isSimpleSorting) { // sort last N items asc if needed
    result = result.sort(function(a,b) {
      return a.ts - b.ts;
    });
  }

	return this.helpers.returnJsonArray(result);
}
