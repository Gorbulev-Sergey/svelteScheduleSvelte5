import { SubField, type ISubField } from './SubField';

export interface IField {
	date: string;
	fields: ISubField[];
}
export function Field(date: string = '', fields: ISubField[] = [SubField()]) {
	return { date, fields };
}
