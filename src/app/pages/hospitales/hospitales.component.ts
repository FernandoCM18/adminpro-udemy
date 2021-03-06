import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  cargando = true;

  constructor( public hospitalServices: HospitalService,
               public modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.modalUploadService.notificacion.subscribe( resp => this.cargarHospitales() );
  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.hospitalServices.buscarHospital( termino ).subscribe( hospitales => this.hospitales = hospitales );

  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal( 'hospitales', id );
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalServices.cargarHospitales().subscribe( hospitales => this.hospitales = hospitales );

  }

  guardarHospital( hospital: Hospital ) {

    this.hospitalServices.actualizarHospital( hospital ).subscribe();

  }

  borrarHospital( hospital: Hospital ) {

    this.hospitalServices.borrarHospital( hospital._id ).subscribe( () => this.cargarHospitales() );

  }

  crearHospital() {

    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      content: { element: 'input' },
      icon: 'info',
      buttons:  [ true ],
      dangerMode: true
    }).then( ( valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      this.hospitalServices.crearHospital(valor).subscribe( () => this.cargarHospitales() );

    });

  }

  actualizarImagen( hospital: Hospital ) {

    this.modalUploadService.mostrarModal('hospitales', hospital._id );
  }



}
