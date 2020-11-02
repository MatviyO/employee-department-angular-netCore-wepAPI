import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from '../../shared.service';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.css']
})
export class AddEditDepartmentComponent implements OnInit {
  @Input() dep: any;
  DepartmentId: string;
  DepartmentName: string;

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.DepartmentId = this.dep.DepartmentId;
    this.DepartmentName = this.dep.DepartmentName;
  }
  addDepartment(): any {
    const value = {
      DepartmentId: this.DepartmentId,
      DepartmentName: this.DepartmentName
    };
    this.service.addDepartment(value).subscribe(res => {
      alert(res.toString());
    });

  }
  updateDepartment(): any {
    const value = {
      DepartmentId: this.DepartmentId,
      DepartmentName: this.DepartmentName
    };
    this.service.updateDepartment(value).subscribe(res => {
      alert(res.toString());
    });
  }

}
