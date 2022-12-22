'use strict';
//voor in javascript
let allNBATeams = [];
let allNBAPlayers = [];

let teams = [
  'c-76ers',
  'c-bucks',
  'c-bulls',
  'c-cavaliers',
  'c-celtics',
  'c-hawks',
  'c-heat',
  'c-hornets',
  'c-knicks',
  'c-magic',
  'c-nets',
  'c-pacers',
  'c-pistons',
  'c-raptors',
  'c-wizards',
  'c-clippers',
  'c-grizzlies',
  'c-jazz',
  'c-kings',
  'c-lakers',
  'c-mavericks',
  'c-nuggets',
  'c-pelicans',
  'c-rockets',
  'c-spurs',
  'c-suns',
  'c-thunder',
  'c-timberwolves',
  'c-trailblazers',
  'c-warriors',
];
let east = [
  'c-76ers',
  'c-bucks',
  'c-bulls',
  'c-cavaliers',
  'c-celtics',
  'c-hawks',
  'c-heat',
  'c-hornets',
  'c-knicks',
  'c-magic',
  'c-nets',
  'c-pacers',
  'c-pistons',
  'c-raptors',
  'c-wizards',
];
let west = [
  'c-clippers',
  'c-grizzlies',
  'c-jazz',
  'c-kings',
  'c-lakers',
  'c-mavericks',
  'c-nuggets',
  'c-pelicans',
  'c-rockets',
  'c-spurs',
  'c-suns',
  'c-thunder',
  'c-timberwolves',
  'c-trailblazers',
  'c-warriors',
];

let htmlWest;
let htmlEast;
let htmlAll;
let htmlLogos;

let randomNum = Math.floor(Math.random() * 15) + 1;

//
const counterAnim = (qSelector, start = 0, end, duration = 1000) => {
  const target = document.querySelector(qSelector);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    target.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);

  end = Math.floor(Math.random() * 15) + 1;
};

let showTeamById = function (id) {
  for (const team of allNBATeams) {
    if (team.teamId == id) {
      //console.log(team);
      return team;
    }
  }
};

let showPopupInfo = function (team) {
  let htmlPopup__Name = '';
  let htmlPopup__Info = '';
  htmlPopup__Name += `
                <div class="c-popup-team__name js-name">
                    <img id="${team.teamId}" class="c-popup-team__icon" src="img/${team.nickname}_${team.city}.png" alt="${team.nickname}_${team.city}">
                    <h2>${team.nickname}</h2>
                </div>`;
  htmlPopup__Info += `<div class="c-popup-team__info js-info">
                    <ul class="c-popup-team__list">
                        <li class="c-popup-team__item"><p>${team.city} (${team.tricode})</p></li>
                    </ul></div>`;

  document.querySelector('.js-name').innerHTML = htmlPopup__Name;
  document.querySelector('.js-info').innerHTML = htmlPopup__Info;
};

let showPopup = function () {
  for (const img of htmlLogos) {
    img.addEventListener('click', function () {
      let selectedTeam = showTeamById(img.id);
      document.querySelector('#popup').classList.remove('o-hide-accessible');
      counterAnim('#counter', 1, randomNum, 1000); //random getal tussen 1 - 15

      showPopupInfo(selectedTeam);
    });
  }
};

let closePopup = function () {
  document.querySelector('#close').addEventListener('click', function () {
    const popup = document.querySelector('#popup');
    popup.classList.add('o-hide-accessible');
  });
};

let showTeams = function (jsonObject) {
  const allTeams = jsonObject.league.standard;
  //console.log(allTeams);
  for (var team of allTeams) {
    if (team.isNBAFranchise == true) {
      //console.log(team);
      allNBATeams.push(team);
    }
  }
  //console.log(allNBATeams);
};

let showConference = function () {
  htmlWest.addEventListener('click', function () {
    for (const i of east) {
      document.querySelector(`.${i}`).style.opacity = 0.5;
    }
    for (const i of west) {
      document.querySelector(`.${i}`).style.opacity = 1;
    }
  });

  htmlEast.addEventListener('click', function () {
    for (const i of west) {
      document.querySelector(`.${i}`).style.opacity = 0.5;
    }
    for (const i of east) {
      document.querySelector(`.${i}`).style.opacity = 1;
    }
  });

  htmlAll.addEventListener('click', function () {
    for (const i of teams) {
      document.querySelector(`.${i}`).style.opacity = 1;
    }
  });
};

const handleData = function (
  url,
  callbackFunctionName,
  callbackErrorFunctionName = null,
  method = 'GET',
  body = null
) {
  fetch(url, {
    method: method,
    body: body,
    // headers: {
    //   'content-type': 'application/json',
    // },
  })
    .then(function (response) {
      if (!response.ok) {
        console.warn(
          `>> Probleem bij de fetch(). Statuscode: ${response.status}`
        );
        if (callbackErrorFunctionName) {
          console.warn(
            `>> Callback errorfunctie ${callbackErrorFunctionName.name}(response) wordt opgeroepen`
          );
          callbackErrorFunctionName(response);
        } else {
          console.warn(
            '>> Er is geen callback errorfunctie meegegeven als parameter'
          );
        }
      } else {
        console.info('>> Er is een response teruggekomen van de server');
        return response.json();
      }
    })
    .then(function (jsonObject) {
      if (jsonObject) {
        console.info('>> JSONobject is aangemaakt');
        console.info(
          `>> Callbackfunctie ${callbackFunctionName.name}(response) wordt opgeroepen`
        );
        callbackFunctionName(jsonObject);
      }
    })
    .catch(function (error) {
      console.warn(`>>fout bij verwerken json: error`);
      if (callbackErrorFunctionName) {
        callbackErrorFunctionName(undefined);
      }
    });
};

let getAPITeams = () => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  handleData(`https://data.nba.net/prod/v2/2022/teams.json`, showTeams);
};

// let getAPIPlayers = () => {
//   // Eerst bouwen we onze url op
//   // Met de fetch API proberen we de data op te halen.
//   // Als dat gelukt is, gaan we naar onze showResult functie.
//   //handleData(`https://data.nba.net/prod/v1/2022/players.json`, showPlayers);
// };

document.addEventListener('DOMContentLoaded', async function () {
  htmlWest = document.querySelector('.js-west');
  htmlEast = document.querySelector('.js-east');
  htmlAll = document.querySelector('.js-all');
  htmlLogos = document.getElementById('logos').children;

  getAPITeams();
  showConference();
  showPopup();
  closePopup();
  //getAPIPlayers();
});
