export interface IField {
	event: string;
	time: string;
	pray: string;
}
export function Field(event: string = '', time: string = '00:00', pray: string = '') {
	return { event, time, pray };
}
