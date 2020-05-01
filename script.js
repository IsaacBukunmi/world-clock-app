const mainUrl = 'https://worldtimeapi.org/api/timezone/';
const ipUrl = 'https://worldtimeapi.org/api/ip';
const ipLocation = document.getElementById("ip-location");
const ipTime = document.getElementById("ip-time");
const locateCity = document.getElementById("get-city");
const displayTime =document.getElementById("display-time");

const search = document.getElementById("search");
const matchList = document.getElementById("match-list");
const addCity = document.getElementById("add-city");
const check = document.getElementById("check");
const checkTime = document.getElementById("check-time");
const worldTime = document.getElementById("world-time");

search.addEventListener('input', getSearchValue);






const getLocalDetails = () => {
    fetch(ipUrl)
    .then((res) => res.json())
    .then((data) => {
        
        const getLocalCity = () => {
            let ipTimeZone = data.timezone;
            let ipTimeZoneArr = ipTimeZone.split("");
            let slicedTimeZone = ipTimeZoneArr.slice((ipTimeZoneArr.indexOf("/")+1));
            let city = slicedTimeZone.join("");
            
            return city;  
        }
        
        const getLocalTime = () => {
            let localTime = new Date(data.datetime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            
            return localTime;
        }
        
        
        
        ipLocation.innerHTML = getLocalCity();
        ipTime.innerHTML = getLocalTime();
    })
    .catch((error) => console.log(error));
    
}

getLocalDetails();


// Search Cities and filter it

const searchCity = (searchText) => {
    fetch(mainUrl)
    .then((res) => res.json())
    .then((cities) => {
        
        const slicedCities = cities.map((item) => {
            items = item.replace(/_/g, " ")
            splitItem = items.split("");
            city = splitItem.slice(items.lastIndexOf('/') + 1).join("");
            return city
        });
        
        let matchedCities = slicedCities.filter(function(city){
            const regex = new RegExp(`^${searchText}`, 'gi');
            return city.match(regex);
        });
        
        if (searchText.length === 0){
            matchedCities=[];
            matchList.innerHTML='';
        }
        
        if(searchText.value !== matchedCities){
            matchList.innerHTML='';
        }

        
        displaySearchCity(matchedCities);
        
        
    }) 
    .catch((error) => console.log(error));
    
}

function getSearchValue(){
    searchCity(search.value);
}



//Function display search city in HTML

function displaySearchCity(matchedCities){
    if (matchedCities.length > 0){
        const display = matchedCities.map(city => {
            const citydisp =
                `
                <div class="city-list" id="city-list">
                ${city}
                </div>
                `  ;
            return citydisp;
        }).join("");

        matchList.innerHTML = display; 
        
        $(".city-list").click((e) => {
            search.value = `${e.target.innerText}`;
            matchList.innerHTML='';
        });
        
        addCity.onclick = () => {

            const new_search = search.value.replace(/ /g, "_");
           
            const regionUrls = [
                `https://worldtimeapi.org/api/timezone/Africa/${new_search}`,
                `https://worldtimeapi.org/api/timezone/America/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Antarctica/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Asia/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Atlantic/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Autstralia/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Europe/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Pacific/${new_search}`,
                `https://worldtimeapi.org/api/timezone/Indian/${new_search}`,
                `https://worldtimeapi.org/api/timezone/America/Argentina/${new_search}`
            ]

            Promise.all(regionUrls.map(url => 
                fetch(url)
                .then((res) => res.json())
                .catch(error => console.log(error))
            ))

            .then((data) => {
                

                const getCityTime = () => {

                    const getExactCityTime = () => {

                        const timeArr = [
                            data[0].datetime,
                            data[1].datetime,
                            data[2].datetime,
                            data[3].datetime,
                            data[4].datetime,
                            data[5].datetime,
                            data[6].datetime,
                            data[7].datetime,
                            data[8].datetime,
                            data[9].datetime
                        ]

                    
                        const filterTimeArr = timeArr.filter(item =>  item !== undefined)

                        const date =  moment.parseZone("" + filterTimeArr[0]);
                        let hours = "" + date.hours();
                        let minutes = "" + date.minutes();
                        let daytime = hours >= 12 ? "PM":"AM";
                        hours = hours % 12;
                        hours = hours.length < 2 ? "0" + hours:hours;
                        hours = hours ? hours : 12;
                        return `${hours}:${minutes} <span>${daytime}</span>`;  
                        

                                        
                            
                    }

                        let cityTime = `
                        <div class="col-lg-4 clock-col" id="clock-col">
                            <div class="round-clock">
                                <div class="inner-round">
                                    <small id="check">${search.value}</small>
                                    <p id="check-time">${getExactCityTime()}</p>
                                </div>
                            </div>
                        </div>
                        `
                        
                        return cityTime;
                    }

                    
                    
                    worldTime.innerHTML += getCityTime();

                    const saveworldTime = [...worldTime.innerHTML].map((item) => item);
                    localStorage.setItem('worldTime', JSON.stringify(saveworldTime));
                    // console.log(saveworldTime);
                    
                        if(worldTime.childElementCount > 3){
                            worldTime.innerHTML = getCityTime();
                        }

                        worldTime.ondblclick = (e) => {
                            e.target.style.display = "none";
                            // if (e.target.classList.contains('clock-col')){
                            //     e.target.style.display = "none";
                            // }
                        }           

            })       
        }
   
    }
}


