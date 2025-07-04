import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    //tan pronto este servicio se monte, dispara este recurso y ejecuta la funcion checkstatus
    stream: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false); //se verifica si es admin, para pasar al guard is-admin

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSucces(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(
    email: string,
    password: string,
    fullName: string
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email: email,
        password: password,
        fullName: fullName,
      })
      .pipe(
        map((resp) => this.handleAuthSucces(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }
  checkStatus(): Observable<boolean> {
    //esta funcion verifica si el usuario sigue autenticado cuando se recarga la app o ingresas nuevamente a la app
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map((resp) => this.handleAuthSucces(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  // =====>>>> ESTA ES LA FORMA DE HACERLO SIN USAR INTERCEPTOR PARA EL TOKEN
  //   checkStatus(): Observable<boolean> {
  //   //esta funcion verifica si el usuario sigue autenticado cuando se recarga la app o ingresas nuevamente a la app
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     this.logout();
  //     return of(false);
  //   }
  //   return this.http
  //     .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .pipe(
  //       map((resp) => this.handleAuthSucces(resp)),
  //       catchError((error: any) => this.handleAuthError(error))
  //     );
  // }

  logout() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);

    localStorage.clear();
  }

  private handleAuthSucces({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated'); // si la solicitud es exitosa el status sera autenticado
    this._token.set(token);

    localStorage.setItem('token', token);

    return true; //para indicar que todo salio bien
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
