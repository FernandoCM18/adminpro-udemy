import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor( public usuarioServices: UsuarioService,
               public modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioServices.cargarUsuarios( this.desde )
      .subscribe( ( resp: any ) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });


  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;

    console.log(desde);

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioServices.buscarUsuarios( termino ).subscribe( (usuarios: Usuario[]) => {

      this.usuarios = usuarios;
      this.cargando = false;

    });


  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this.usuarioServices.usuario._id ) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar asi mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo',
      cancelButtonText: 'No, cancela',
      reverseButtons: true
    })
    .then( borrar => {

      if ( borrar.value ) {
        this.usuarioServices.borrarUsuario( usuario._id ).subscribe( borrado => {
          console.log(borrado);
          this.cargarUsuarios();
        });

      } else if ( borrar.dismiss === Swal.DismissReason.cancel ) {
        Swal.fire('Cancelado', 'Tranquilo no se ha borrado nada!!', 'error');
      }

    });

  }

  guardarUsuario( usuario: Usuario ) {
    this.usuarioServices.actualzarUsuario( usuario ).subscribe();
  }

}
