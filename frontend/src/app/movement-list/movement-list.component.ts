import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movement } from '../models/movement.model';
import { MovementService } from '../services/movement.service';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movement-list.component.html',
  styleUrls: ['./movement-list.component.scss']
})
export class MovementListComponent {
  @Input() movements: Movement[] = [];

  constructor(private movementService: MovementService) {}

  deleteMovement(id: number): void {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      this.movementService.delete(id).subscribe({
        next: () => {
          // Actualizar la lista eliminando el movimiento localmente
          this.movements = this.movements.filter(m => m.id !== id);
        },
        error: (err) => console.error('Error deleting movement:', err)
      });
    }
  }
}