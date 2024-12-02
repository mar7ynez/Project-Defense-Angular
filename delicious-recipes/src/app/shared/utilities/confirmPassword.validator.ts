import { ValidatorFn } from "@angular/forms";

export const confirmPasswordValidator = (passwordControlName: string, confirmPasswordControlName: string): ValidatorFn => {

    return (control) => {
        return control.get(passwordControlName)?.value === control.get(confirmPasswordControlName)?.value ? null : { confirmPassword: 'Confirm password does not match!' };
    }
}