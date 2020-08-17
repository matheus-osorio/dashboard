function inteiroIntervalo(min,max){
    return () => {
        return min + (parseInt(Math.random()) % max)
    }
}


