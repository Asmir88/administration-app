import { FormularField } from '../formular/formular-field.model';

export class FormularVersion {
    constructor(
        public id: number,
        public version: string,
        public fields: any[]
    ) {}
}