import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from '../../shared.service';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {
  @Input() dep: any;
  EmployeeId: string;
  EmployeeName: string;
  Department: string;
  DateOfJoining: string;
  PhotoFileName: string;
  PhotoFilePath: string;

  DepartmentList: any[] = [];

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.loadDepartmentList();
  }

  loadDepartmentList(): any {
    this.service.getAllDepartmentNames().subscribe(res => {
      this.DepartmentList = res;
      this.EmployeeId = this.dep.EmployeeId;
      this.EmployeeName = this.dep.EmployeeName;
      this.Department = this.dep.Department;
      this.DateOfJoining = this.dep.DateOfJoining;
      this.PhotoFileName = this.dep.PhotoFileName;
      this.PhotoFilePath = this.service.PhotoUrl + this.PhotoFileName;
    });
  }

  addEmp(): any {
    const value = {
      DepartmentId: this.EmployeeId,
      DepartmentName: this.EmployeeName,
      Department: this.Department,
      DateOfJoining: this.DateOfJoining
    };
    this.service.addEmployee(value).subscribe(res => {
      alert(res.toString());
    });

  }
  updateEmp(): any {
    const value = {
      DepartmentId: this.EmployeeId,
      DepartmentName: this.EmployeeName
    };
    this.service.updateEmployee(value).subscribe(res => {
      alert(res.toString());
    });
  }
  uploadPhoto(event): any {
    const file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    this.service.UploadPhoto(formData).subscribe(res => {
      this.PhotoFileName = res.toString();
      this.PhotoFilePath = this.service.PhotoUrl + this.PhotoFileName;
    });
  }

}
