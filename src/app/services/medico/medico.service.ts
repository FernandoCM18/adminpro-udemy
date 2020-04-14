import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

// import { SweetAlert } from 'sweetalert/typings/core';
// import * as _swal from 'sweetalert';
// const swal: SweetAlert = _swal as any;

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos = 0;

  constructor( public http: HttpClient,
               public usuarioService: UsuarioService ) { }

  cargarMedicos() {

    const url = `${URL_SERVICIOS}/medico`;

    return this.http.get( url ).pipe( map( ( resp: any ) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));

  }

  cargarMedico( id: string ) {

    const url = `${URL_SERVICIOS}/medico/${ id }`;

    return this.http.get( url ).pipe( map( ( resp: any ) => resp.medico ));

  }

  buscarMedicos( termino: string ) {

    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${ termino }`;

    return this.http.get( url ).pipe( map( ( resp: any ) => resp.medicos ) );

  }

  borrarMedicos( id: string ) {
    const url = `${URL_SERVICIOS}/medico/${ id }?token=${ this.usuarioService.token }`;

    return this.http.delete( url ).pipe( map( (resp) => {
      Swal.fire('Médico borrado', 'Médico borrado correctamente', 'success');
      return true;
    }));

  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // Actualiando

      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put( url, medico ).pipe( map( ( resp: any ) => {

        Swal.fire('Medico Actualizado', medico.nombre, 'success');
        return resp.medico;

      }));

    } else {
      // Creando

      url += '?token=' + this.usuarioService.token;

      return this.http.post( url, medico ).pipe( map( ( resp: any ) => {

        Swal.fire('Médico Creado', medico.nombre, 'success');
        return resp.medicos;
      }));

    }


  }

}
