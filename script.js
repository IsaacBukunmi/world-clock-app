const mainUrl = 'http://worldtimeapi.org/api/timezone/';
const ipUrl = 'http://worldtimeapi.org/api/ip';
const ipLocation = document.getElementById("ip-location");
const ipTime = document.getElementById("ip-time");
const locateCity = document.getElementById("get-city");
const displayTime =document.getElementById("display-time");

const search = document.getElementById("search");
const matchList = document.getElementById("match-list");
search.addEventListener('input', getSearchValue)





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
        const display = matchedCities
            .map(
                city => 
                    `
                    <div class="city-list" id="city-list">
                        ${city}
                    </div>
                    `      

        ).join("");

        matchList.innerHTML = display;  
           
    }
}


   