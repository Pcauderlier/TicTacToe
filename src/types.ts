export type gameArrayType = Array<Array<""| "X" | "O">>

export type winingObjType = {
    winner : ''|"X"|"O"
    win : boolean,
    col: number,
    line : number,
    diag : boolean,
    oppositDiag : boolean
}
export type branchMemoryType = {
    [depth:number] : number
}


export type resultType =  Array<{move : {col:number,line:number},checkBranch : branchMemoryType}>