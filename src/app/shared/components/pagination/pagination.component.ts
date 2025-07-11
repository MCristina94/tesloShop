import {
  Component,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);
  activatePage = linkedSignal(this.currentPage); //se recomienda usar linkedSignal cuando se inicializa con un input que puede cambiar
  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
