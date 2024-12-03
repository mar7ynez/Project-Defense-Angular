import { AbstractControl, FormGroup } from "@angular/forms";
import { errorTypes } from "../types/error";
import { controlNameTypes } from "../types/controlNames";

export const getErrorMsg = (form: FormGroup, abstractControl: AbstractControl | null, controlName: string) => {
    const control = form?.controls[controlName] || abstractControl?.get(controlName);

    const controlNames: controlNameTypes = {
        rePass: 'Confirm password',
        recipeTitle: 'Recipe title',
        imageUrl: 'Image URL'
    }

    const controlNameCapital = controlNames[controlName as keyof controlNameTypes] ? controlNames[controlName as keyof controlNameTypes] : controlName.replace(controlName[0], controlName[0].toUpperCase());

    if (controlName === 'rePass' && abstractControl?.errors) {
        return abstractControl.errors['confirmPassword'];
    }

    const errorMessages: errorTypes = {
        required: `${controlNameCapital} is required!`,
        emailPattern: `${controlNameCapital} does not match the required pattern!`,
        minlength: (requiredLength: number) => `${controlNameCapital} must be at least ${requiredLength} characters long!`,
    }

    for (const errorType in errorMessages) {
        if (control.hasError(errorType as keyof errorTypes)) {
            if (errorType === 'minlength') {
                const requiredLength = control.errors?.['minlength'].requiredLength;

                return errorMessages.minlength(requiredLength)
            }
            return errorMessages[errorType as keyof errorTypes]
        }
    }

    return '';
}

export const isFieldTouchedAndInvalid = (form: FormGroup, abstractControl: AbstractControl | null, controlName: string): boolean => {
    if (controlName === 'rePass' || controlName === 'password') {
        return !!abstractControl?.get(controlName)?.touched && !!abstractControl?.errors || !!abstractControl?.get(controlName)?.errors && !!abstractControl?.get(controlName)?.touched;
    }

    return form.controls[controlName].invalid && form.controls[controlName].touched;
}