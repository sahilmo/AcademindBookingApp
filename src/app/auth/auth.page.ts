import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    console.log(email, password);

  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  onLogin() {
    this.isLoading = true;
    this.loadingController
      .create({
        keyboardClose: true,
        spinner: 'circles',
        message: 'Logging In..',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService.login();
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigateByUrl('/place/tabs/discover');
          loadingEl.dismiss();
        }, 1500);
      });
  }
}
