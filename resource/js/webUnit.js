

let createQueryString = params => {
    
    let arr = []
    for(key in params){
        arr.push(key + '=' + params[key])
    }

    return arr.join('&')

}