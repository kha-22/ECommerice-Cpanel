import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ComplaintsService } from "src/app/services/complaints.service";
import { ModalService } from "src/app/services/modal.service";

@Component({
  selector: "app-complaints",
  templateUrl: "./complaints.component.html",
  styleUrls: ["./complaints.component.css"],
})
export class ComplaintsComponent implements OnInit {
  questionList: any;
  message: any;

  constructor(
    private complaintsService: ComplaintsService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getQuestionWithRepayes();
  }

  getQuestionWithRepayes() {
    this.complaintsService.getQuestionWithReplayes().subscribe(
      (result: any) => {
        this.questionList = result;
        console.log(this.questionList);
      },
      (err) => {
        this.toastr.error("An expected occure error");
      }
    );
  }

  sendAnswer(id: number) {
    this.complaintsService.sendAnswer(id, this.message).subscribe(
      (result: any) => {
        this.toastr.success("Answer has been send");
        this.getQuestionWithRepayes();
      },
      (err) => {
        this.toastr.error("An expected occure error");
      }
    );
  }
}
