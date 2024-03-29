import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ForbiddenNameValidator } from './shared/user-name.valdator';
import { PasswordValidator } from './shared/password.validators';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  registrationForm!: FormGroup<any>;
  // registrationForm = new FormGroup({
  //   userName: new FormControl('Vishwas'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl('')
  //   })
  // });
  constructor(
    private fb: FormBuilder,
    private _registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        userName: [
          '', Validators.compose([
            Validators.required,
            Validators.minLength(3),
            ForbiddenNameValidator(/password/)
          ])
        ],
        password: [''],
        confirmPassword: [''],
        email: [''],
        subscribe: [false],
        address: this.fb.group({
          city: [''],
          state: [''],
          postalCode: [''],
        }),
        alternateEmails: this.fb.array([]),
      },
      { validator: PasswordValidator }
    );

    this.registrationForm
      .get('subscribe')!
      .valueChanges.subscribe((checkedValue) => {
        const email = this?.registrationForm?.get('email');
        if (checkedValue) {
          email?.setValidators(Validators.required);
        } else {
          email?.clearValidators();
        }
        email?.updateValueAndValidity();
      });
  }

  get userName() {
    return this.registrationForm.get('userName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''));
  }

  loadAPIData() {
    this.registrationForm.patchValue({
      userName: 'Zehra',
      password: 'test',
      confirmPassword: 'test',
    });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value).subscribe(
      (response) => console.log('Success!', response),
      (error) => console.error('Error!', error)
    );
  }
}

/* WE USE PATCHVALUE METHOD TO SUPPLY DATA TO THE NECESSARY FIELDS 
  loadAPIData() {
    this.registrationForm.patchValue({
      name: 'Zehra',
      password: 'test',
      confirmPassword: 'test',
    });
  }
}*/

/* registrationForm = new FormGroup({
    userName: new FormControl('Shane'),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    address: new FormGroup({
      city: new FormControl(''),
      state: new FormControl(''),
      postalCode: new FormControl(''),
    }),
  }); */

/* MUST NECESSARY TO GIVE ALL THE VALUE TO THE FIELDS BCZ WE USE SET VALUE
  loadAPIData() {
    this.registrationForm.setValue({
      userName: 'Zehra',
      password: 'test',
      confirmPassword: 'test',
      address: {
        city: 'City',
        state: 'State',
        postalCode: '123456',
      },
    });
  } */
