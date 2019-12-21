import { FormularField } from './formular-field.model';

export class Formular {
    constructor(
        public id: number,
        public name: string,
        public fields: FormularField[]
    ) {}
}