import { classes } from "./classes";
import { lessons } from "./lessons";
import { teachers } from "./teachers";

export class schedule {
    private teachersArray: Array <teachers>
    private lessonsArray: Array <lessons> 
    private classesArray: Array <classes> 
    private show:boolean = false;
    private maxClassSize = 2000;

    constructor(){
        this.classesArray = [];
        this.lessonsArray = [];
        this.teachersArray = [];
    }

    getTeachersArray(){
        return this.teachersArray;
    }

    getlessonsArray(){
        return this.lessonsArray;
    }

    getclassesArray(){
        return this.classesArray;
    }

    getShow(){
        return this.show;
    }

    getCallSize(){
        return this.maxClassSize;
    }

    addLesson(lessonName:string,time:string){
        let addNewLesson = true;
        if (this.lessonsArray.length == 0) { // Ders listedi boş ise
            const lesson = new lessons(lessonName,time)
            this.lessonsArray.push(lesson);
        }
        else{
            for (let searchLesson = 0; searchLesson < this.lessonsArray.length; searchLesson++) { 
                if (this.lessonsArray[searchLesson].controlName(lessonName)) {//Girilen ders önceden listeye eklendi mi ? 
                    addNewLesson = false;
                 }
             }
            if (addNewLesson) { // Yeni ders ekle
                const lesson = new lessons(lessonName,time)
                this.lessonsArray.push(lesson);
            }
        }
    }
    addTeacher(teacherName:string,lessonName:string){
        let addNewTeacher=true;
        let addNewBranch=true;
        if (this.teachersArray.length == 0) { // Öğretmen listesi boş ise
            const Teachers = new teachers(teacherName,lessonName);
            this.teachersArray.push(Teachers);
        }
        else{
            let teacherIndex = 0;
            for (let searchTeachers = 0; searchTeachers < this.teachersArray.length; searchTeachers++) { 
                if (this.teachersArray[searchTeachers].controlName(teacherName)) {//Girilen öğretmen önceden listeye eklendi mi ? 
                    addNewTeacher = false;
                    if (this.teachersArray[searchTeachers].controlBranch(lessonName)) {//Girilen ders bu öğretmenin branch listesinde var mı ?
                    addNewBranch = false;
                    }
                    else teacherIndex = searchTeachers; // Yeni branşın ekleneceği öğretmenin indexi
                }
            }
            if (addNewTeacher && addNewBranch) { // Yeni öğretmen ve branşı ekle
                const Teachers = new teachers(teacherName,lessonName);
                this.teachersArray.push(Teachers);
            }
            else if (!addNewTeacher && addNewBranch) { // Var olan öğretmene yeni branş ekle
                this.teachersArray[teacherIndex].addBranch(lessonName);
            }
        }
    }

    addClass(className:string){
        if(className!='' && this.classRepeatControl(className)){
            const clas = new classes(className);
            this.classesArray.push(clas);
        }
        else alert("Enter the information completely and only once");
    }

    deleteTeacher(Teachername:string,LessonName:string){
        for (let index = 0; index < this.teachersArray.length; index++) {
            if (this.teachersArray[index].getName() == Teachername && this.teachersArray[index].getBranch().length <2) { //öğretmen tek ders veriyorsa
                this.teachersArray.splice(index,1)
            }
            else if (this.teachersArray[index].getName() == Teachername && this.teachersArray[index].getBranch().length >=2) { //öğretmen birden çok ders veriyorsa
                this.teachersArray[index].deleteBranch(LessonName);
            }     
        }
    }

    deleteLesson(LessonName:string){
        let TeacherCount = 0;
        for (let index = 0; index < this.teachersArray.length; index++) { // Silinecek dersi kaç öğretmen verdiğine bakılıyor sayı birden fazlaysa silme
            if (this.teachersArray[index].controlBranch(LessonName)) {
                TeacherCount++;
            }
        }
        if (TeacherCount == 1) { // Dersi birden fazla öğretmen veriyorsa dersi silme
            for (let index = 0; index < this.lessonsArray.length; index++) {
                if (this.lessonsArray[index].getName() == LessonName) {
                    this.lessonsArray.splice(index,1)
                }     
            }
        }
    }

    deleteClass(index:number){
        this.classesArray.splice(index,1)
    }

    buildSchedule(){
        for (let deleteTeachers = 0; deleteTeachers < this.teachersArray.length; deleteTeachers++) {
            this.teachersArray[deleteTeachers].delete();
        }
        for (let deleteClasses = 0; deleteClasses < this.classesArray.length; deleteClasses++) {
            this.classesArray[deleteClasses].delete();
        }
        this.createDistribution();
        if (this.controlDistribution() && this.controlTotalLessonTime()) {
            this.maxClassSize--;
            if (this.maxClassSize == 0) {
                this.maxClassSize = 2000;
                this.show = false;
                alert("Something went wrong. Please try again.")
            }
            else this.creatSchedule();
        }
    }

    private controlDistribution(){
        let totalDistribution = 0;
        for (let i = 0; i < this.teachersArray.length; i++) {
            totalDistribution = 0;
            for (let j = 0; j < this.teachersArray[i].getDistribution().length; j++) {
                totalDistribution += this.teachersArray[i].getDistribution()[j];
            }
            if (totalDistribution > 25) {
                alert("Check lesson times")
                return 0;
            }
        }
        return 1;
    }

    private controlTotalLessonTime(){
        let totalLessonTime = 0;
        for (let i = 0; i < this.lessonsArray.length; i++) {
            totalLessonTime += parseInt(this.lessonsArray[i].getTime());
        }
        if (totalLessonTime == 25) {
            return 1;
        }
        else {
            alert("Check lesson times")
            return 0;
        }
    }

    private createDistribution(){
        for (let lessonIndex = 0; lessonIndex < this.lessonsArray.length; lessonIndex++) { // Sırayla öğretmenlere ders saati ataması yap
            let teachers = this.teachersNames(this.lessonsArray[lessonIndex].getName());
            let lessonTime = parseInt(this.lessonsArray[lessonIndex].getTime());
            let totalTime = this.classesArray.length * lessonTime;
            let lessonName = this.lessonsArray[lessonIndex].getName();
            if (teachers.length == 1) { // Dersi tek öğretmen veriyorsa
                this.teachersArray[teachers[0]].setDistribution(totalTime,lessonName);
            }
            else if(teachers.length == 2 && this.teachersBranchControl(teachers)){ // Dersi birden fazla öğretmen veriyorsa içlerinde tek ders veren var mı
                let index = this.witchTeacher(teachers);
                if((totalTime * 75 / 100) % lessonTime == 0 && (totalTime * 25 / 100) % lessonTime == 0){ // sınıf sayısı çift ise
                    for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
                        if (index == teachers[teacherIndex]) {
                            this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*75/100,lessonName)
                        }
                        else this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*25/100,lessonName)
                    }
                }
                else{ //sınıf sayısı farklı ise
                    let remainder = (totalTime * 75 / 100) % lessonTime
                    for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
                        if (index == teachers[teacherIndex]) {
                            this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*75/100 + (lessonTime - remainder),lessonName)
                        }
                        else this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*25/100 - (lessonTime - remainder),lessonName)
                    }
                }
            }
            else if(teachers.length == 2 && !this.teachersBranchControl(teachers)){
                if((totalTime * 50 / 100) % lessonTime == 0){ // sınıf sayısı çift ise
                    for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
                        this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*50/100,lessonName)
                    }
                }
                else{ //sınıf sayısı farklı ise 
                    let remainder = (totalTime * 50 / 100) % lessonTime
                    for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
                        if (teacherIndex == 0) {
                            this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*50/100 - (lessonTime - remainder),lessonName)
                        }
                        else this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*50/100 + (lessonTime - remainder),lessonName)
                    }
                }
            }
            else if (teachers.length>2){
                for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
                    if (teacherIndex==teachers.length-1) {  
                        this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*50/100,lessonName)
                    }
                    else this.teachersArray[teachers[teacherIndex]].setDistribution(totalTime*25/100,lessonName)
                }
            }
        }
    }

    private witchTeacher(teachers:Array<number>){
        let answer = 0;
        for (let index = 0; index < teachers.length; index++) {
            if (this.teachersArray[teachers[index]].getBranch().length <2) {
                answer = teachers[index];
            }
        }
        return answer;
    }

    private teachersBranchControl(teachers:Array<number>){ // Öğretmen tek ders veriyorsa 1 dön
        for (let index = 0; index < teachers.length; index++) {
            if (this.teachersArray[teachers[index]].getBranch().length <2) {
                return 1;
            }
        }
        return 0;
    }

    private teachersNames(lessonName:string){ // Seçilen dersi hangi öğretmenlerin verdiği bul
        let teachers: Array<number> = []
        for (let teacherIndex = 0; teacherIndex < this.teachersArray.length; teacherIndex++) {
            if (this.teachersArray[teacherIndex].controlBranch(lessonName)) {
                teachers.push(teacherIndex)
            }
        }
        return teachers;
    }


    private classRepeatControl(className:string){ // Aynı isimde sınıf eklenmiş mi ?
        for (let i = 0; i < this.classesArray.length; i++) {
            if (this.classesArray[i].getName()==className) {
                return 0;
            }
        } return 1;
    }

    private getLessonIndex(){ // Random bir ders seç
        return Math.floor(Math.random() * this.lessonsArray.length)
    }

    private getClassName(classIndex:number){
        return this.classesArray[classIndex].getName();
    }

    private getLessonName(lessonIndex:number){
        return this.lessonsArray[lessonIndex].getName();
    }

    private getLessonTime(lessonIndex:number){
        return this.lessonsArray[lessonIndex].getTime();
    }

    private getTeacherIndex(teacherName:string){
    let teacherIndex = 0;
    for (let index = 0; index < this.teachersArray.length; index++) {
        if(this.teachersArray[index].getName() == teacherName){
        teacherIndex = index;
        }
    }
    return teacherIndex;
    }

    private getTeacherName(lessonName:string){
    let teacherCount = this.howManyTeacher(lessonName); // Seçilen dersi kaç öğretmen veriyor
    let teacherName = "";
    for (let index = 0; index < this.teachersArray.length; index++) {
        if (this.teachersArray[index].controlBranch(lessonName) && teacherCount < 2) { // Dersi veren öğretmeni bulunca gir
        teacherName = this.teachersArray[index].getName();
        }
        else if (this.teachersArray[index].controlBranch(lessonName) && teacherCount >= 2 && this.howManyTimes(index,lessonName)) { // Dersi birden fazla öğretmen veriyorsa seçilen öğretmen kaç defa bu dersi verdi ?
        teacherName = this.teachersArray[index].getName();
        }
    }
    return teacherName;
    }

    private howManyTeacher(lessonName:string){
    let count = 0;
    for (let index = 0; index < this.teachersArray.length; index++) {
        if (this.teachersArray[index].controlBranch(lessonName)) {
        count++;
        }
    }
    return count;
    }

    private howManyTimes(teacherIndex:number,lessonName:string){ // Gelen öğretmen dersi vermeye uygun mu 
        let count = 0;
        for (let index = 1; index < this.teachersArray[teacherIndex].getWeeklySchedule().length; index++){ // Seçilen öğretmen bu dersi kaç defa vermiş
            if (this.teachersArray[teacherIndex].getWeeklySchedule()[index].split(" ")[2] == lessonName) {
            count++;
            }
        }
        if (count < this.teachersArray[teacherIndex].getDistribution2(lessonName)){
            return 1;
        }
        else return 0;
    }

    private teacherControl(selectedTeacherIndex:number,hour:number){ // Öğretmenin dersi boş mu ?
        if (this.teachersArray[selectedTeacherIndex].getWeeklySchedule()[hour] == "empty") {
            return true;
        }
        else return false;
    }
    private repeatControl(weeklyScheduleIndex:number,classIndex:number,selectedLessonName:string){ // Sınıf bu dersi kaç defa aldı
        let lessonTimeCount = 0;
        for (let repeatControl = 1; repeatControl < weeklyScheduleIndex; repeatControl++) { 
            let pastLesson = this.classesArray[classIndex].getWeeklySchedule()[repeatControl].split(" "); // Ders adını bul
            if (pastLesson[0] == selectedLessonName) {
                lessonTimeCount++; //kaç defa aldı
            }
        }
        return lessonTimeCount;
    }
    
    private addSchedule(selectedTeacherIndex:number,weeklyScheduleIndex:number,classIndex:number,selectedClassName:string,selectedLessonName:string,selectedTeacherName:string){
        this.teachersArray[selectedTeacherIndex].getWeeklySchedule()[weeklyScheduleIndex] = selectedClassName + " - " + selectedLessonName; // öğretmene hangi sınıfa girdiğini yaz
        this.classesArray[classIndex].getWeeklySchedule()[weeklyScheduleIndex] = selectedLessonName + " - " + selectedTeacherName ; // sınıfa dersin adını yaz  
    }

    private creatSchedule(){
        let stuckControl =0;
        for (let classIndex = 0; classIndex < this.classesArray.length; classIndex++) { // sınıfı seç
            let weeklyScheduleIndex = 1;  
            while (weeklyScheduleIndex < this.teachersArray[classIndex].getWeeklySchedule().length) {// seçilen sınıfın tüm dersleri dolana kadar dön
                while (this.classesArray[classIndex].getWeeklySchedule()[weeklyScheduleIndex] == "empty") { // seçilen sınıfın weeklyScheduleIndex. dersi dolana kadar dön              
                    let selectedlessonIndex = this.getLessonIndex(); // Random seçilen dersin indexi
                    let selectedLessonName = this.getLessonName(selectedlessonIndex); // Random seçilen dersin adı
                    let selectedLessonTime = this.getLessonTime(selectedlessonIndex);  // Random seçilen dersin saati
                    let selectedTeacherName = this.getTeacherName(selectedLessonName); // Random seçilen dersi veren öğretmen
                    let selectedTeacherIndex = this.getTeacherIndex(selectedTeacherName); // Random seçilen dersi veren öğretmenin indexi
                    let selectedClassName = this.getClassName(classIndex);
                    let lessonTimeCount = this.repeatControl(weeklyScheduleIndex,classIndex,selectedLessonName);

                    if (this.teacherControl(selectedTeacherIndex,weeklyScheduleIndex) && lessonTimeCount < parseInt(selectedLessonTime))  { // öğretmenin dersi yoksa ekle
                        this.addSchedule(selectedTeacherIndex,weeklyScheduleIndex,classIndex,selectedClassName,selectedLessonName,selectedTeacherName)
                        stuckControl = 0;
                    }
                    else {
                        stuckControl++;
                        if (stuckControl > 150) {
                            classIndex = this.classesArray.length;
                            weeklyScheduleIndex = this.teachersArray[classIndex].getWeeklySchedule().length;
                            break;
                        }
                    }
                }
                if (stuckControl > 150) {
                    this.buildSchedule();
                    break;
                }else weeklyScheduleIndex++;
            }
        }
        this.show=true;
    }
}