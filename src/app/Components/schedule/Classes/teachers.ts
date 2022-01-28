export class teachers {
    private name: string;
    private branch: Array<string> =[];
    private days = 26;
    private distribution: Array<number> = [];
    private weeklySchedule: Array <String> = [];

    constructor(name: string, branch: string){
        this.name = name;
        this.branch.push(branch);
        this.delete();
    }
    getName(){
        return this.name;
    }

    controlName(teacherName:string){
        return this.name.includes(teacherName);
    }
    getBranch(){
        return this.branch
    }

    controlBranch(lessonName:string){
        return this.branch.includes(lessonName);
    }

    addBranch(lessonName:string){
        this.branch.push(lessonName);
    }

    deleteBranch(lessonName:string){
        this.branch.splice(this.branch.indexOf(lessonName),1)
    }

    getWeeklySchedule(){
        return this.weeklySchedule;
    }

    getDistribution(){
        return this.distribution;
    }

    getDistribution2(lessonName:string){ // parametre olarak gelen dersi kaç defa vermesi gerektiği dönüyor
        return this.distribution[this.branch.indexOf(lessonName)]
    }

    setDistribution(distribution:number,lessonName:string){
        
        for (let index = 0; index < this.branch.length; index++) {
            if (lessonName == this.branch[index]) {
                this.distribution[index] = distribution;
            }          
        }
    }

    delete(){
        for (let i = 1; i < this.days; i++) {   
            this.weeklySchedule[i] = "empty";
        }
        for (let i = 0; i < this.distribution.length; i++) {
            this.distribution[i] = 0;
        }
    }
}