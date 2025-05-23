import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movement } from '../models/movement.model';
import { MovementService } from '../services/movement.service';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.scss']
})
export class MovementFormComponent {
  @Output() movementAdded = new EventEmitter<void>();
  movementForm: FormGroup;
  categories: string[] = ['Comida', 'Transporte', 'Entretenimiento', 'Salario', 'Servicios'];

  constructor(
    private fb: FormBuilder,
    private movementService: MovementService
  ) {
    this.movementForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.movementForm.valid) {
      const movementData = this.movementForm.value;
      this.movementService.create(movementData).subscribe({
        next: () => {
          this.movementAdded.emit();
          this.movementForm.reset({
            amount: 0,
            type: 'expense',
            date: new Date().toISOString().substring(0, 10)
          });
        },
        error: (err) => console.error('Error creating movement:', err)
      });
    }
  }
}