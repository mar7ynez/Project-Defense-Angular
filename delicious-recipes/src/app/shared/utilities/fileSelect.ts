import { FormGroup } from "@angular/forms";

export const fileSelect = (event: Event, form: FormGroup, setImageData: (data: string | null) => void) => {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.files) {
        const file = inputElement.files[0];
        
        form.patchValue({ image: file });

        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (file && allowedMimeTypes.includes(file.type)) {
            const reader = new FileReader();

            reader.onload = () => {
                setImageData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
};