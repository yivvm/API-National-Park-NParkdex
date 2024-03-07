const np_container = document.getElementById('np-container');

// Get parkCode for 60+ national parks from NPS-Unit-List.json in the same folder
// const np_count = 10;
// const np_code = ['acad', 'dena', 'yell']
const np_codes = []
async function getAllParkCode () {
    try {
        const response = await fetch('NPS-Unit-List.json');
        const data = await response.json();
        console.log(data)

        // Find national parks as "Type":"NP"
        data.forEach((unit) => {
            if (unit.Type === "NP") {
                np_codes.push(unit["Park Code"])
            }
        })

        // console.log(np_codes) 
        // TODO: got 59 NPs as the result, will look up the rest/updated ones later

    } catch (error) {
        console.error(error)
    }
}

// getAllParkCode();
// console.log(np_codes)

const colors = {
    'AL': 'Alabama',
    'AK': '#F5F5F5',
    'AZ': '#FDDFDF',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'FFFFE0',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'E5E5E5',
    'ME': '#E0CCFF',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': '#DEFDE0',
    'ND': '#E6E0D4',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'B3ECFF',
    'PA': 'Pennsylvania',
    'RI': '#F5F5F5',
    'SC': '#EAEDA1',
    'SD': '#F8D5A3',
    'TN': '#98D7A5',
    'TX': 'FFF4B3',
    'UT': 'FFD9B3',
    'VT': '#FCEAFF',
    'VA': '#F4E7DA',
    'WA': 'Washington',
    'WV': '#DEF3FD',
    'WI': '#FCF7DE',
	"WY": '#97B3E6'
}

const main_type = Object.keys(colors);

const fetchNPs = async () => {
    await getAllParkCode();
    console.log(np_codes)
    np_codes.forEach((parkCode) => {
        // console.log(parkCode);
        getNP(parkCode);
    })
}

// Make API request
async function getNP (parkCode) {
    const url = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}`;
    const options = {
        method: 'GET',
        headers: {
            'X-Api-Key': 'umpGwi4hscmLlusLAwDh1QCX9x4cBsEqqcfNGeQi',
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result.data[0])
        // console.log(result.data[0].addresses[0].stateCode)
        // console.log(result.data[0].images[0].url)
        // console.log(result.data[0]['fullName']);
        createNPCard(result);

    } catch (error) {
        console.error(error)
    }
}

const createNPCard = (park) => {
    const parkEl = document.createElement('div');
    parkEl.classList.add('park');
    // console.log(`park: ${park}`)

    if (park) {
    // if (park && park.data && park.data[0] && park.data[0].images && park.data[0].images[0]) {

        const park_stateCode = park.data[0].addresses[0].stateCode;
        const color = colors[park_stateCode]
        parkEl.style.backgroundColor = color;
    
        const image_url = park.data[0].images[0].url;
        const name = park.data[0]['name'];
        const state = park.data[0].states;

        const parkInnerHtml = 
        `
        <div class='image-container'>
            <img src="${image_url}">
        </div>

        <div class='info'>
            <h3 class='name'>${name}</h3>
            <small class='state'><span>${state}</span></small>
        </div>

        `
        // TODO: add a div for short "description" inside parkInnerHTML, define the size of the this div

        parkEl.innerHTML = parkInnerHtml;
        np_container.appendChild(parkEl)
    } else {
        console.error(`Invalid park data`)
    }
    
}


fetchNPs();