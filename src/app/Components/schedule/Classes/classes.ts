export class classes {
    private name: string;
    private weeklySchedule: Array<string> = []
    private days = 26;
    constructor(name: string){
        this.name = name;
        this.delete();
    }

    getName(){
        return this.name;
    }

    getWeeklySchedule(){
        return this.weeklySchedule;
    }

    delete(){
        for (let i = 1; i < this.days; i++) {   
            this.weeklySchedule[i] = "empty";
        }
    }

}