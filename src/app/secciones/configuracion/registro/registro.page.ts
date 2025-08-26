import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.registerForm = this.formBuilder.group({
      mail: ['', Validators.compose([Validators.maxLength(70), Validators.email, Validators.required])]
    });
  }

  ngOnInit() { }

  register() {
    console.log('Registro - Mail', this.registerForm.value.mail);
    const navigationExtras: NavigationExtras = {
      state: {
        mail: this.registerForm.value.mail,
        newUser: true
      }
    };
    this.router.navigate(['/perfil'], navigationExtras);
    console.log('Registro - NavigationExtras', navigationExtras);
  }

}
