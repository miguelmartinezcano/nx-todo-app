import { Component, input } from '@angular/core';
import {
  AccordionGroup,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
} from '@angular/aria/accordion';

@Component({
  selector: 'shared-accordion',
  imports: [AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss'
})
export class Accordion {
  questions = input.required<{ question: string; answer: string }[]>();
}
