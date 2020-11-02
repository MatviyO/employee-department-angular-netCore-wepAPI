import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../shared.service';

@Component({
  selector: 'app-show-employee',
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.css']
})
export class ShowEmployeeComponent implements OnInit {

  EmployeeList: any[] = [];
  ModalTitle: string;
  ActivateAddEdit = false;
  emp: any;

  constructor(private service: SharedService) {
  }

  ngOnInit(): void {
    this.refreshDepList();
  }

  refreshDepList(): any {
    this.service.getEmpList().subscribe(res => {
      this.EmployeeList = res;
    });
  }

  addClick(): any {
    this.emp = {
      EmployeeId: 0,
      EmployeeName: '',
      Department: '',
      DateOfJoining: '',
      PhotoFileName: 'anonymous.png'
    };
    this.ModalTitle = 'Add Employee';
    this.ActivateAddEdit = true;

  }

  closeModal(): any {
    this.ActivateAddEdit = false;
    this.refreshDepList();
  }

  editClick(item: any): any {
    this.emp = item;
    this.ModalTitle = 'Edit Employee';
    this.ActivateAddEdit = true;
  }

  deleteClick(id: number): any {
    if (confirm('Are you sure ?!')) {
      this.service.deleteEmployee(id).subscribe(res => {
        alert(res.toString());
        this.refreshDepList();
      });
    } else {
      return null;
    }
  }
}
