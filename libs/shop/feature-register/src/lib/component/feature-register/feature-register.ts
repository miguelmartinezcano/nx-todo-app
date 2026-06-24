import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RegistrationData } from '../../model/feature-register.model'
import { form, FormField, required, email, pattern, maxLength } from '@angular/forms/signals';
import { Accordion } from '@org/shared/ui-accordion';

@Component({
  selector: 'lib-feature-register',
  imports: [Accordion, FormField],  
  templateUrl: './feature-register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './feature-register.scss',
})
export class FeatureRegister {
  accordionQuestions = [
    {
      question: 'What will we do with this information?',
      answer:
        'We will use this information to create your account and provide you with access to our services.',
    },
    {
      question: 'Will I be bothered with marketing and communication emails?',
      answer:
        'We will only send you emails if you explicitly opt-in to receive them. You can unsubscribe at any time.',
    },
    {
      question: 'Can I change my information later?',
      answer:
        'Yes, you can update your information at any time by logging into your account and navigating to the settings page.',
    },
  ];

  registrationModel = signal<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    pin: '',
    marketingConsent: false,
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
