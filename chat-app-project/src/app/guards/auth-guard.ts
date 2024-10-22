import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {Injectable} from "@angular/core";
import {catchError, map, Observable, of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../components/dialog/dialog.component";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService,
              private router: Router,
              private dialog: MatDialog) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(result => {
        if (!result.isSuccess) {
          this.router.navigate(['/auth']);
          return false;
        }
        return true;
      }),
      catchError(error => {
        console.log('Error occurred:', error.error.message);
        if (error.status === 401) {
          this.router.navigate(['/auth']);
        }

        this.dialog.open(DialogComponent, {
          data: error.error.message
        });

        return of(false);
      })
    );
  }
}
