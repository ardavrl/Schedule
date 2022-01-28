export class lessons {
    private name: string;
    private time: string;

    constructor(name: string,time:string){
        this.name = name;
        this.time = time;
    }
    getName(){
        return this.name;
    }
    getTime(){
        return this.time;
    }
    controlName(lessonName:string){
        return this.name.includes(lessonName);
    }
}