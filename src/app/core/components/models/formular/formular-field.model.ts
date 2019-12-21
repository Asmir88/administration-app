import { RadioButtonField } from './radio-button-field.model';

export class FormularField {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public quantity: number,
        public validator: string,
        public radioButtonFields: RadioButtonField[]
    ) {}
}