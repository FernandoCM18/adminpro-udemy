import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor( public usuarioServices: UsuarioService,
               public router: Router ) {}

  canActivate() {

    if ( this.usuarioServices.estaLogueado() ) {
      return true;
    } else {
      console.log(('BLOQUEADO POR EL GUARD'));
      this.router.navigate(['/login']);
      return false;
    }

  }

}
