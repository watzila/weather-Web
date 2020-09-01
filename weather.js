var getInfos = null;
var infoLength = null;
var dt = new Date();

var mainPage = document.querySelector(".mainPage").querySelector(".pageWrap");
var l = document.querySelector(".location");
var weatherIMG = document.querySelector(".weatherIMG");
var t = document.querySelector(".t").querySelector("span");
var weatherP = document.querySelector(".weatherP");
var weatherInfos = document.querySelector(".weatherInfo").querySelectorAll("li");
var date = document.querySelector(".date").querySelectorAll("li");

var weatherWrap = document.querySelectorAll(".weatherWrap");
var eyeL = document.querySelectorAll(".l");
var eyeR = document.querySelectorAll(".r");

var currentNum;
var currentT = true;
var search = false;

//獲取所有整理好的天氣資訊
function updateInfos(data) {
  getInfos = data;
}

//設定第一頁所有顯示的天氣資訊
function setInfos(num) {
  currentNum = num;
  currentT = true;
  l.innerHTML = getInfos[num].location;
  t.innerHTML = Math.floor((parseInt(getInfos[num].minT) + parseInt(getInfos[num].maxT)) / 2);
  wxLite(num);

  weatherInfos[0].querySelector(".pop").innerHTML = getInfos[num].pop + "%";
  weatherInfos[1].querySelector(".ci").innerHTML = getInfos[num].ci;
  weatherInfos[2].querySelector(".wx").innerHTML = getInfos[num].wx;
  weatherInfos[3].querySelector(".minT").innerHTML = getInfos[num].minT + "˚C";
  weatherInfos[4].querySelector(".maxT").innerHTML = getInfos[num].maxT + "˚C";

  date[0].querySelector(".year").innerHTML = dt.getFullYear();
  date[1].querySelector(".month").innerHTML = monthEnglish[dt.getMonth()];
  date[2].querySelector(".day").innerHTML = dt.getDate();
  date[3].querySelector(".week").innerHTML = dayEnglish[dt.getUTCDay()];

  if (infoLength == null) {
    infoLength = getInfos.length;
  }
  mainPage.style.opacity = "1";
  setTimeout("fadeOut(" + num + ")", 10000);
}

//判斷晴、陰、雨、雪天
function wxLite(num) {
  var value = parseInt(getInfos[num].wxV);
  switch (value) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
      weatherP.innerHTML = "晴";
      weatherIMG.style.background = "url(img/sunIMG.svg) no-repeat center";
      break;

    case 7:
    case 8:
    case 9:
    case 10:
      weatherP.innerHTML = "陰";
      weatherIMG.className = "weatherIMG";
      break;

    case 42:
      weatherP.innerHTML = "雪";
      weatherIMG.className = "weatherIMG";
      break;

    default:
      weatherP.innerHTML = "雨";
      weatherIMG.className = "weatherIMG";
  }
}

//淡出時
function fadeOut(num) {
  if (!search) {
    mainPage.style.opacity = "0";
    setTimeout("changeInfos(" + num + ")", 2000);
  }
}

//更換第一頁縣市天氣資訊
function changeInfos(num) {
  if (!search) {
    //console.log(num);
    setInfos(infoLength - 1 == num ? 0 : ++num);
  }
}

//眼睛看著鼠標
function eyesMove(e, i) {
  var eyeLX, eyeLRY, eyeRX;
  var x = e.clientX;
  var y = e.clientY;
  var directionLX = (x - (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2)) * 5;
  var directionLY = (y - (weatherWrap[i].offsetTop + weatherWrap[i].offsetHeight / 2)) * 5;

  if (directionLX < 0) {
    eyeLX = directionLX / (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2);
    eyeRX = (directionLX * 2) / (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2);
  } else {
    eyeLX =
      (directionLX * 2) /
      (window.innerWidth - (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2));
    eyeRX =
      directionLX /
      (window.innerWidth - (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2));
  }
  if (directionLY < 0) {
    eyeLRY = directionLY / (weatherWrap[i].offsetTop + weatherWrap[i].offsetHeight / 2);
  } else {
    eyeLRY =
      directionLY /
      (window.innerHeight - (weatherWrap[i].offsetTop + weatherWrap[i].offsetHeight / 2));
  }

  eyeL[i].style.left = 40 + eyeLX + "%";
  eyeL[i].style.top = 45 + eyeLRY + "%";

  eyeR[i].style.left = 55 + eyeRX + "%";
  eyeR[i].style.top = 45 + eyeLRY + "%";
  //console.log(a);
}

//溫度換算
function convertT(CorF) {
  var newValue;
  if (!CorF && currentT) {
    newValue = Math.round((t.innerHTML * 9) / 5 + 32);
    currentT = false;
  } else if (CorF && !currentT) {
    newValue = Math.round(((t.innerHTML - 32) * 5) / 9);
    currentT = true;
  } else {
    return;
  }
  t.innerHTML = newValue;
}

//第一頁搜尋縣市天氣
function searchW(localValue) {
  for (i = 0; i < getInfos.length; i++) {
    if (getInfos[i].location == localValue) {
      search = true;
      currentNum = i;
      mainPage.style.opacity = "0";
      setTimeout("setInfos(" + i + ")", 2000);
      setTimeout(function () {
        search = false;
      }, 10000);
    } else {
      continue;
    }
  }
}
