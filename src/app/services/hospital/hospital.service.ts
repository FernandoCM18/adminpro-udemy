import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales = 0;

  constructor( public http: HttpClient,
               public usuarioService: UsuarioService ) {

  }

  cargarHospitales() {

    const url = `${URL_SERVICIOS}/hospital`;

    return this.http.get( url ).pipe( map( ( resp: any ) => {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    }));

  }

  obtenerHospital( id: string ) {

    const url = `${URL_SERVICIOS}/hospital/${ id }`;

    return this.http.get( url ).pipe( map( ( resp: any ) => resp.hospital ));

  }

  crearHospital( nombre: string ) {

    const url = `${URL_SERVICIOS}/hospital?token=${ this.usuarioService.token }`;

    return this.http.post( url, { nombre } ).pipe( map( ( resp: any ) => resp.hospital ));

  }

  actualizarHospital( hospital: Hospital ) {

    const url = `${URL_SERVICIOS}/hospital/${ hospital._id }?token=${ this.usuarioService.token }`;

    return this.http.put( url, hospital ).pipe( map( ( resp: any ) => {

      Swal.fire('Hospital Actualizado', hospital.nombre, 'success');

      return resp.hospital;
    }));

  }

  buscarHospital( termino: string ) {

    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${ termino }`;

    return this.http.get( url ).pipe( map( ( resp: any ) => resp.hospitales ));

  }

  borrarHospital( id: string ) {

    const url = `${URL_SERVICIOS}/hospital/${ id }?token=${ this.usuarioService.token }`;

    return this.http.delete( url ).pipe( map( resp => {

      Swal.fire('Hospital borrado', 'El hospital a sido borrado correctamente', 'success');
      return true;

    }));

  }

}
