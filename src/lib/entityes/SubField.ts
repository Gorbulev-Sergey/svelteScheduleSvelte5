export interface ISubField {
	event: string;
	time: string;
	pray: string;
}
export function SubField(event: string = '', time: string = '00:00', pray: string = '') {
	return { event, time, pray };
}
