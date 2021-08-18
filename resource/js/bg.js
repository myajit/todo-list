

let getCoords = () => {
    return new Promise((resolve,reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position.coords)
            console.log(position.coords)
        }) 
    })
}


let getLocationWeather = async() => {
    let coords = await getCoords();

    let queryString = createQueryString({
        lat:coords.latitude,
        lon:coords.longitude,
        units:'metric',
        lang:'kr',
        appid:'0c8c4bb90e40df23aef4ce3f73c219d9'
    })

    console.dir(queryString)


    // let url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=mtreic&lang=kr&appid=0c8c4bb90e40df23aef4ce3f73c219d9`
    let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`
    let response = await fetch(url)
    let datas = await response.json()
    

    return {
        temp:datas.main.temp,
        loc:datas.name
    } 

    let temp = datas.main.temp
    let loc = datas.name
    console.dir(temp)
    console.dir(datas)
}

// getLocationWeather()



let getBackgroundImg = async () => {

    let prevLog = localStorage.getItem('bg-log') 
    
    if(prevLog) {
        prevLog = JSON.parse(prevLog);
        if(prevLog.expirationOn > Date.now()){
            return prevLog.bg;
        }
    }

    let imgInfo = await requsetBackgroundImg()
    registBackgroundLog(imgInfo)
    
    return imgInfo
 }


 let requsetBackgroundImg = async() => {
    let url = 'https://api.unsplash.com/photos/random';
    
    let response = await fetch(url,{
       headers:{Authorization:'Client-ID gF80xMBqS44OU0XcngFMoVuyHLLpHBaouxFzDPT1UTg'}
    });
    
    let datas = await response.json();
    
    return {
        url : datas.urls.regular,
        desc : datas.description
    }
 }
 

let registBackgroundLog = imgInfo => {
    // 통신이 끝난 시간
    let expirationDate = new Date()
    // 테스트를 위해 데이터 만료시간을 1분 뒤로 설정
    expirationDate = expirationDate.setDate(expirationDate.getDate()+1)

    let bgLog = {
        expirationOn : expirationDate,
        bg:imgInfo
    }

    localStorage.setItem('bg-log',JSON.stringify(bgLog))
}

// getBackgroundImg()

let renderBackground = async() => {
    
    let LocationWeather = await getLocationWeather() 
    let backgroundImg = await getBackgroundImg() 

    document.querySelector('.txt-location').innerHTML = `${LocationWeather.temp}˚ @ ${LocationWeather.loc}`

    document.querySelector('body').style.background = `url(${backgroundImg.url}) no-repeat`;
    document.querySelector('body').style.backgroundSize = `cover`
    
    if(backgroundImg.desc) {
        document.querySelector('.txt-bg').innerHTML = backgroundImg.desc
    }
}

renderBackground()

