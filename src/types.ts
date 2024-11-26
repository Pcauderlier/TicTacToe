export type gameArrayType = Array<Array<""| "X" | "O">>

export type winingObjType = {
    winner : ''|"X"|"O"
    win : boolean,
    col: number,
    line : number,
    diag : boolean,
    oppositDiag : boolean
}