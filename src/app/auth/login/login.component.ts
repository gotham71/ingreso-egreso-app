import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(  private fb: FormBuilder,
                private authService: AuthService,
                private store: Store<AppState>,
                private route: Router ) { }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        correo: ['', [Validators.required, Validators.email ]],
        password: ['', [Validators.required]]
      })

      this.uiSubscription =  this.store.select('ui')
                                  .subscribe( ui => this.cargando = ui.isLoading );

  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario(correo, password)
      .then(credenciales => {
        //console.log(credenciales);

        this.store.dispatch( ui.stopLoading() );
        // Swal.close();
        this.route.navigate(['/']);
      })
      .catch(error => {
        this.store.dispatch( ui.stopLoading() );

        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: error.message
        // })
      });
  }


}
