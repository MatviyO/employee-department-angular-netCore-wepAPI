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

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.EmployeeId = this.dep.EmployeeId;
    this.EmployeeName = this.dep.EmployeeName;
  }
  addEmp(): any {
    const value = {
      DepartmentId: this.EmployeeId,
      DepartmentName: this.EmployeeName
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

}
