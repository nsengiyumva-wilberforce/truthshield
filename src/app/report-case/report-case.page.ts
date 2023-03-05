import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-case',
  templateUrl: './report-case.page.html',
  styleUrls: ['./report-case.page.scss'],
})
export class ReportCasePage implements OnInit {
  reportForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      parties_involved: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      time: ['']
    });
  }

  ngOnInit() {
  }

  submitReport() {
    if (this.reportForm.valid) {
      console.log(this.reportForm.value);
    }
  }

}
