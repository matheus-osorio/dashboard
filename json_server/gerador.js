const setores = ['setor1','setor2','setor3']

const dias = 30

const mes = 20

function geradorRange(min,max){
    return () => {
       return (min + parseInt(Math.random()*1000)) % max
    }
}


function criaValores(qtde,rand){
    const arr = []
    for(let i=0;i<qtde;i++){
        arr.push(rand())
    }

    return arr
}

function criaHistorico(dias,meses,setores){
    const total = []
    for(let i=0;i<meses;i++){
        let linha = []
        for(let setor of setores){
            let valor = criaValores(dias,geradorRange(0,1000))
            let funcionarios = criaValores(dias,geradorRange(10,30))
            let obj = {
                setor,
                valor,
                funcionarios:{
                    diario: funcionarios,
                    total: funcionarios.reduce((max,atual) => {return Math.max(max,atual)})
                }
            }
            linha.push(obj)
        }
        total.push(linha)
    }
    return total
}


const resultado = criaHistorico(dias,mes,setores)

console.log(JSON.stringify(resultado))