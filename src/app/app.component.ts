import { Component } from '@angular/core';
import { schedule } from './Components/schedule/Classes/schedule';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lists = new schedule();
  
  lessonsTablo: Array<string> = []
  classesTablo: Array<string> = []
  fakeArray = new Array(5);
  
  constructor() { }
  
  add(lessonName:string,time:string,teacherName:string){
    this.lessonsTablo.push(lessonName + " " + time + " " + teacherName);
    this.lists.addLesson(lessonName,time)
    this.lists.addTeacher(teacherName,lessonName);
  }

  addClass(className:string){
    this.classesTablo.push(className);
    this.lists.addClass(className);
    console.log(this.lists.getTeachersArray());
    console.log(this.lists.getlessonsArray())
  }

  createSchedule(){
    this.lists.buildSchedule();
  }
}