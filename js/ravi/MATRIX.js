class Matrix{
    static average(matrix){
        let s=0;
        let t=0;
        matrix.forEach((sM)=>{
            sM.forEach((e)=>{
                s+=e;
                t++;
            });
        });
        return s/t;
    }

    static transpose(matrix) {
        var trans = [];
        matrix.forEach(function(row, y){
            row.forEach(function(col, x){
                if (!trans[x]) trans[x] = [];
                trans[x][y] = col;
            });
        });
        return trans;
    }

    

}