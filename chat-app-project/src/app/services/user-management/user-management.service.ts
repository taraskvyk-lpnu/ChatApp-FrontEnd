import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/Dtos/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  userAPI : string = 'http://localhost:5114/api/users';

  constructor(private httpClient: HttpClient) { }

  findByUserIds(userIds: string[]): Observable<User[]> {
    const params = { ids: userIds };
    return this.httpClient.get<User[]>(this.userAPI, { params });
  }

  findByUserId(userId: string) {
    return this.httpClient.get<User[]>(this.userAPI + `/${userId}`);
  }

  findByFilter(filter: string) {
    return this.httpClient.get<User[]>(this.userAPI + `/filter/${filter}`);
  }
}
