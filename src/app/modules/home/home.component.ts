import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {AuthRequest} from "../../../models/interfaces/auth/AuthRequest";
import {SignUpUserRequest} from "../../../models/interfaces/user/SignUpUserRequest";
import {Subject, takeUntil, tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {environments} from "../../../environments/environments";
import {ToastMessage} from "../../services/toast-message/toast-message";
import {ProgressBarModule} from "primeng/progressbar";
import {MedicalSpecialty} from "../../../models/interfaces/enums/medicalSpeciality/medicalSpeciality";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ToastMessage]
})
export class HomeComponent implements OnDestroy {
  logoUrl?= "../../../assets/img/doctor-home.svg";
  loginCard = true;
  errorMessage = "";
  private destroy$ = new Subject<void>();
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';
  showPassword: boolean = false;

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });

  signUpForm = this.formBuilder.group({
    username: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    speciality: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private messageService: MessageService,
              private router: Router,
              private toastMessage: ToastMessage) {
  }

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading =true
      this.userService.authUser(this.loginForm.value as AuthRequest).pipe(
        takeUntil(this.destroy$),
        tap(
          (response) => {
            if (response) {
              this.cookieService.set(this.USER_AUTH, response?.token)
              this.errorMessage = "";
              this.loginForm.reset();
              this.isLoading = false
              this.router.navigate(["/dashboard"])
              this.toastMessage.SuccessMessage(`Seja bem vindo ${response.username}`)
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.isLoading = false
          this.toastMessage.ErrorMessage('Erro ao efetuar login')
        }
      });
    } else {
      this.isLoading = false
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }

  onSubmitSignUp(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true
      this.userService.signupUser(this.signUpForm.value as SignUpUserRequest).pipe(
        takeUntil(this.destroy$),
        tap(
          (response) => {
            if (response) {
              this.signUpForm.reset();
              this.loginCard = true;
              this.isLoading = false
              this.toastMessage.SuccessMessage(`Usuário criado com sucesso!`)
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.isLoading = false
          this.toastMessage.ErrorMessage(`Erro ao efetuar cadastro`)
        }
      });
    } else {
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
