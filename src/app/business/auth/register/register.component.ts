import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
	FormBuilder,
	FormGroup,
	Validators,
	AbstractControl,
	ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RegisterService } from '../../../core/services/register/register.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		CommonModule,
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export default class RegisterComponent {
	registerForm: FormGroup;
	faEye = faEye;
	faEyeSlash = faEyeSlash;
	showPassword = false;
	showConfirmPassword = false;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private registerService: RegisterService
	) {
		this.registerForm = this.fb.group(
			{
				name: ['', Validators.required],
				lastName: ['', Validators.required],
				email: ['', Validators.required],
				password: [
					'',
					[
						Validators.required,
						Validators.minLength(8),
						Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
					],
				],
				confirmPassword: ['', [Validators.required]],
			},
			{ validators: this.passwordMatchValidator }
		);
	}

	passwordMatchValidator(control: AbstractControl) {
		const password = control.get('password')?.value;
		const confirmPassword = control.get('confirmPassword')?.value;
		return password === confirmPassword
			? null
			: { passwordsMismatch: true };
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}

	toggleConfirmPasswordVisibility() {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	goToHome() {
		this.router.navigate(['/start']);
	}

	onSubmit() {
		if (this.registerForm.valid) {
			const formData = { ...this.registerForm.value };
			delete formData.confirmPassword;

			const { name, lastName, email, password } = formData;
			this.registerService
				.register({ name, lastName, email, password })
				.subscribe({
					next: (response) => {
						this.router.navigate(['/login']);
					},
					error: (e: HttpErrorResponse) => {
						console.log('Error: ', e);
						alert('Error: ' + e.error.message);
					},
				});
		} else {
			alert('Las contraseñas no coinciden o faltan datos');
			this.registerForm.markAllAsTouched();
		}
	}
}
