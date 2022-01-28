import { Component, OnInit } from '@angular/core';
import { schedule } from './Classes/schedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent{

  lists = new schedule();
  lessonsTablo: Array<string> = []
  fakeArray = new Array(5);

  showLists: boolean = true;
  showSchedules: boolean = false;
  showReports: boolean =false;

  btnList = "Hide Lists";
  btnSchedule = "Show Schedules";
  btnReports = "Show Reports";
  
  constructor() { }

  add(lessonName:string,time:string,teacherName:string){ 
    if (lessonName !="" && time !="" && teacherName !="") {
      this.lessonsTablo.push(this.getUpper(lessonName) + " " + time + " " + this.getUpper(teacherName));
      this.lists.addLesson(this.getUpper(lessonName),time)
      this.lists.addTeacher(this.getUpper(teacherName),this.getUpper(lessonName));
    }
  }

  deleteTeacherAndLesson(object:string,index:number){
    this.lessonsTablo.splice(index,1)
    this.lists.deleteLesson(object.split(" ")[0])
    this.lists.deleteTeacher(object.split(" ")[2],object.split(" ")[0])
  }

  addClass(className:string){
    this.lists.addClass(className.toUpperCase());
    console.log(this.lists.getTeachersArray());
    console.log(this.lists.getlessonsArray())
  }

  deleteClass(object:number){
    this.lists.deleteClass(object);
  }

  createSchedule(){
    this.lists.buildSchedule();
    if (this.lists.getShow() && this.lists.getCallSize() != 2000) {
      alert("Schedule created successfully")
    }
  }

  changeList(butonText:string){
    if (butonText == "Hide Lists") {
      this.showLists = false;
      this.btnList = "Show Lists"
    }
    else{
      this.showLists = true;
      this.btnList = "Hide Lists"
    }
  }
  changeSchedule(butonText:string){
    if (butonText == "Hide Schedules") {
      this.showSchedules = false;
      this.btnSchedule = "Show Schedules"
    }
    else{
      this.showSchedules = true;
      this.btnSchedule = "Hide Schedules"
    }
  }
  changeReport(butonText:string){
    if (butonText == "Hide Reports") {
      this.showReports = false;
      this.btnReports = "Show Reports"
    }
    else{
      this.showReports = true;
      this.btnReports = "Hide Reports"
    }
  }

  private getUpper (name:string){
    let upperName = "";
    for (let index = 0; index < name.length; index++) {
      if (index == 0) {
        upperName += name[index].toUpperCase();
      }
      else upperName += name[index]
    }
    return upperName
  }
}
