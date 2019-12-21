import { FormularField } from '../formular/formular-field.model';
import { Formular } from '../formular/formular.model';

export class FormularVersion {
    constructor(
        public id: number,
        public version: string,
        public fields: any[],
        public formular: Formular
    ) {}
}