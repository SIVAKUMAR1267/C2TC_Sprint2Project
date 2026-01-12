import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private API = 'http://localhost:8082/shopowners';

  constructor(private http: HttpClient) { }

  // CREATE
  registerOwner(ownerData: any): Observable<any> {
    return this.http.post(this.API, ownerData);
  }

  // READ (all)
  getOwners(): Observable<any> {
    return this.http.get(this.API);
  }

  // READ (by id)
  getOwnerById(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  // UPDATE
  updateOwner(id: number, ownerData: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, ownerData);
  }

  // DELETE
  deleteOwner(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, { responseType: 'text' });
  }
}
