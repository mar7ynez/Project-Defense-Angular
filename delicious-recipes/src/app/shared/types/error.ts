export interface errorTypes {
  required: string;
  pattern: string;
  minlength: (requiredLength: number) => string;
}