import { AbstractControl, ValidationErrors } from "@angular/forms";

export const emailValidator = (control: AbstractControl): ValidationErrors | null => {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    return !emailPattern.test(control.value) ? { emailPattern: 'Invalid Email' } : null;
}