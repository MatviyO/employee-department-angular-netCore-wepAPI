import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly ApiUrl = 'http://localhost:53918/api';
  readonly PhotoUrl = 'http://localhost:53918/Photos/';

  constructor(private http: HttpClient) { }

  getDepList(): Observable<any[]> {
    return this.http.get<any[]>(this.ApiUrl + '/Department');
  }

  addDepartment(value: any): any {
    return this.http.post(this.ApiUrl + '/Department', value);
  }
  updateDepartment(value: any): any {
    return this.http.put(this.ApiUrl + '/Department', value);
  }
  deleteDepartment(id: number): any {
    return this.http.delete(this.ApiUrl + '/Department/' + id);
  }

  getEmpList(): Observable<any[]> {
    return this.http.get<any[]>(this.ApiUrl + '/Employee');
  }

  addEmployee(value: any): any {
    return this.http.post(this.ApiUrl + '/Employee', value);
  }
  updateEmployee(value: any): any {
    return this.http.put(this.ApiUrl + '/Employee', value);
  }
  deleteEmployee(id: number): any {
    return this.http.delete(this.ApiUrl + '/Employee/' + id);
  }

  UploadPhoto(value: any): any {
    return this.http.post(this.ApiUrl + '/Employee/SaveFile', value);
  }
  getAllDepartmentNames(): Observable<any[]> {
    return this.http.get<any[]>(this.ApiUrl + '/Employee/GetAllDepartmentNames');
  }
}
