export interface errorTypes {
    required: string;
    emailPattern: string;
    minlength: (requiredLength: number) => string;
  }