import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export default class RegisterComponent {
  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        password: [
        '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
          ]
        ],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  login() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value; 
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      alert("Registro exitoso");
      this.router.navigate(['/login']);
    } else {
      alert("Las contraseñas no coinciden o faltan datos");
      this.registerForm.markAllAsTouched();
    }
  }
}
