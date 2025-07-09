export function getThingerAssetsEndpoint(asset: string): string {
	let endpoint = `/v1/users/{user}/${asset}s`;
	switch (asset) {
		case 'alarm_instance':
			endpoint = `/v1/users/{user}/alarms/instances`;
			break;
		case 'alarm_rule':
			endpoint = `/v1/users/{user}/alarms/rules`;
			break;
		case 'brand':
		case 'domain':
		case 'host':
		case 'oauth_client':
		case 'user':
			endpoint = `/v1/${asset}s`;
			break;
		case 'property':
			endpoint = `/v1/users/{user}/properties`;
			break;
		case 'proxy':
			endpoint = `/v1/proxies`;
			break;
	}

	return endpoint;
}

export function priorDate(ts: Date, units: string, value: number): Date {
	let priorTs = new Date();
	switch (units) {
		case 's':
			priorTs = new Date(ts.setSeconds(ts.getSeconds() - value));
			break;
		case 'm':
			priorTs = new Date(ts.setMinutes(ts.getMinutes() - value));
			break;
		case 'h':
			priorTs = new Date(ts.setHours(ts.getHours() - value));
			break;
		case 'd':
			priorTs = new Date(ts.setDate(ts.getDate() - value));
			break;
		case 'w':
			priorTs = new Date(ts.setDate(ts.getDate() - value * 7));
			break;
		case 'mo':
			priorTs = new Date(ts.setDate(ts.getMonth() - value));
			break;
		case 'y':
			priorTs = new Date(ts.setFullYear(ts.getFullYear() - value));
			break;
	}
	return priorTs;
}
