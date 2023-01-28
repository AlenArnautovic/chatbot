export const activePatiens: PatientInfo[] = [];

export interface PatientInfo{
    userId:string,
    firstName: string,
    lastName:string,
    age:number,
    vNumber:number,
    disease:string[]
    //TODO extend
}