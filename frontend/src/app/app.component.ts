import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MovementService } from './services/movement.service';

interface Movement {
  id?: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class AppComponent implements OnInit {
  movements: Movement[] = [];
  movementForm: FormGroup;
  editingId: number | null = null;
  categories: string[] = ['Comida', 'Transporte', 'Entretenimiento', 'Salario', 'Servicios'];
  balance = 0;
  totalIncome = 0;
  totalExpense = 0;

  constructor(
    private fb: FormBuilder,
    private movementService: MovementService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    this.movementForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.movementService.getAll().subscribe({
      next: (data: Movement[]) => {
        this.movements = data;
        this.calculateTotals();
      },
      error: (err: any) => console.error('Error loading movements:', err)
    });
  }

  calculateTotals(): void {
    this.totalIncome = this.movements
      .filter(m => m.type === 'income')
      .reduce((sum, m) => sum + m.amount, 0);

    this.totalExpense = this.movements
      .filter(m => m.type === 'expense')
      .reduce((sum, m) => sum + m.amount, 0);

    this.balance = this.totalIncome - this.totalExpense;
  }

  onSubmit(): void {
    if (this.movementForm.valid) {
      const movementData = this.movementForm.value;

      if (this.editingId) {
        this.movementService.update(this.editingId, movementData).subscribe({
          next: () => {
            this.loadMovements();
            this.resetForm();
          },
          error: (err: any) => console.error('Error updating movement:', err)
        });
      } else {
        this.movementService.create(movementData).subscribe({
          next: () => {
            this.loadMovements();
            this.resetForm();
          },
          error: (err: any) => console.error('Error creating movement:', err)
        });
      }
    }
  }

  editMovement(movement: Movement): void {
    this.editingId = movement.id || null;
    this.movementForm.patchValue({
      ...movement,
      date: movement.date.substring(0, 10)
    });
  }

  deleteMovement(id: number): void {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      this.movementService.delete(id).subscribe({
        next: () => this.loadMovements(),
        error: (err: any) => console.error('Error deleting movement:', err)
      });
    }
  }

  resetForm(): void {
    this.movementForm.reset({
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().substring(0, 10)
    });
    this.editingId = null;
  }
}