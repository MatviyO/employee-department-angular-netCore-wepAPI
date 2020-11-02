import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../shared.service';

@Component({
  selector: 'app-show-department',
  templateUrl: './show-department.component.html',
  styleUrls: ['./show-department.component.css']
})
export class ShowDepartmentComponent implements OnInit {
  DepartmentList: any[] = [];
  ModalTitle: string;
  ActivateAddEdit = false;
  dep: any;

  constructor(private service: SharedService) {
  }

  ngOnInit(): void {
    this.refreshDepList();
  }

  refreshDepList(): any {
    this.service.getDepList().subscribe(res => {
      this.DepartmentList = res;
    });
  }

  addClick(): any {
    this.dep = {
      DepartmentId: 0,
      DepartmentName: ''
    };
    this.ModalTitle = 'Add Department';
    this.ActivateAddEdit = true;

  }

  closeModal(): any {
    this.ActivateAddEdit = false;
    this.refreshDepList();
  }

  editClick(item: any): any {
    this.dep = item;
    this.ModalTitle = 'Edit Department';
    this.ActivateAddEdit = true;
  }

  deleteClick(id: number): any {
    if (confirm('Are you sure ?!')) {
      this.service.deleteDepartment(id).subscribe(res => {
        alert(res.toString());
        this.refreshDepList();
      });
    } else {
      return null;
    }
  }
}
