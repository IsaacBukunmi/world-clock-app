const mainUrl = 'http://worldtimeapi.org/api/timezone/';
const ipUrl = 'http://worldtimeapi.org/api/ip';
const ipLocation = document.getElementById("ip-location");
const ipTime = document.getElementById("ip-time");
const locateCity = document.getElementById("get-city");
const displayTime =document.getElementById("display-time");

const search = document.getElementById("search");
const matchList = document.getElementById("match-list");
const addCity = document.getElementById("add-city");
const check = document.getElementById("check");
const checkTime = document.getElementById("check-time");
const worldTime = document.getElementById("world-time")

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
            

                const regionUrls = [
                    `http://worldtimeapi.org/api/timezone/Africa/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/America/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Antarctica/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Asia/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Atlantic/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Autstralia/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Europe/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Pacific/${search.value}`,
                    `http://worldtimeapi.org/api/timezone/Indian/${search.value}`
                ]

                Promise.all(regionUrls.map(url => 
                    fetch(url)
                    .then((res) => res.json())
                    .catch(error => console.log(error))
                ))

                .then((data) => {

                    // console.log(data[1].datetime);

                    const getCityTime = () => {

                        const getExactCityTime = () => {

                              
                                    const date =  new Date("" + data[0].datetime);
                                    let hours = "" + date.getHours();
                                    let minutes = "" + date.getMinutes();
                                    let daytime = hours >= 12 ? "PM":"AM";
                                   
                                    hours = hours ? hours : 12;
                                    hours = hours % 12;
                                    hours = hours.length < 2 ? "0"+ hours:hours;
                                    minutes = minutes.length < 2 ? "0" + minutes:minutes;
        
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


