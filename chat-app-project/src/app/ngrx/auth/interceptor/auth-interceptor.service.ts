import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from "../../../services/cookies/cookie.service";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.getCookie('access_token');

  if(token) {
    const cloneReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(cloneReq);
  }

  return next(req);
};

