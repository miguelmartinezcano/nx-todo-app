import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RegistrationData } from '../../model/feature-register.model'
import { form, FormField, required, email, pattern, maxLength } from '@angular/forms/signals';

@Component({
  selector: 'lib-feature-register',
  imports: [FormField],
  templateUrl: './feature-register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './feature-register.scss',
})
export class FeatureRegister {
  registrationModel = signal<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    pin: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.firstName, { message: 'First name is required' });
    required(schemaPath.lastName, { message: 'Last name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.pin, { message: 'Pin is required' });
    pattern(schemaPath.pin, /^\d{4}$/, { message: 'Pin must be 4 digits' });
    maxLength(schemaPath.pin, 4, { message: 'Pin must be 4 digits' });
  });
}
