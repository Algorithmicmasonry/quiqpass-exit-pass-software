export interface TextInputProps {
  id: string;
  name: string;
  type: string;
  required: boolean;
  disabled: boolean;
  placeholder: string;
}
export interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}


export interface OnboardingFormProps{
  firstName: string;
  lastName: string;
  email: string
}

export type SessionData = {
    user: {
        name: string | null;
        image: string | null;
        // Add other properties you might need from the user object
    } | null;
} | null;


export const roles = ['porter', 'CSO', 'Assistant CSO', 'Security']
export type PassType = "short" | "long"

export interface FormData {
  passType: PassType
  reason: string
  destination: string
  departureDate: string
  departureTime: string
  returnDate: string
  returnTime: string
  emergencyContact: string
  emergencyPhone: string
  additionalNotes: string
  parentNotification: boolean
}