import { Buffer } from "buffer";

export function getApiUser(apiToken: string) {
	const decodedJWT = JSON.parse(Buffer.from(apiToken.split('.')[1], 'base64').toString());
	return decodedJWT.usr;
}

export function sortObjectArray(array: any, property: string) {
	let array_ = array;
	array_.sort(function (a: { [x: string]: number; }, b: { [x: string]: number; }) {
		if (a[property] > b[property]) return 1;
		if (a[property] < b[property]) return -1;
		return 0;
	});
	return array_
}

