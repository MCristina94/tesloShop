import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
}
