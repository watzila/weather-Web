var getInfos = null; //第一頁全部資訊
var getInfos2 = null; //第二頁全部資訊
var getWeekInfos2 = []; //第二頁地區一周資訊
var infoLength = null;
var dt = new Date(); //當天日期

var mainPage = document.querySelector(".mainPage").querySelector(".pageWrap");
var secondPage = document.querySelector(".secondPage").querySelector(".pageWrap");
var l = document.querySelector(".location"); //第一頁縣市名
var weatherIMG = document.querySelectorAll(".weatherIMG");
var currentT = document.querySelector(".currentT").querySelector("span");
var weatherP = document.querySelector(".weatherP");
var weatherInfos = document.querySelector(".weatherInfo").querySelectorAll("span");
var localInfos = document.querySelector(".localInfos").querySelectorAll("span");
var oneWeekW = document.querySelector(".oneDayW").querySelectorAll("button");
var date = document.querySelector(".date").querySelectorAll("li");

var weatherWrap = document.querySelectorAll(".weatherWrap");
var eyeL = document.querySelectorAll(".l"); //左眼
var eyeR = document.querySelectorAll(".r"); //右眼

var currentNum; //第二頁地區陣列編號
var current = true;
var search = false; //第一頁是否在搜尋
var timer;
var day = 0; //第二頁一周

//獲取縣市所有整理好的天氣資訊
function updateInfos(data) {
  getInfos = data;
}

//獲取台中市區所有整理好的天氣資訊
function updateInfos2(data) {
  getInfos2 = data;
}

//設定第一頁所有顯示的天氣資訊
function setInfos(num) {
  current = true;
  l.innerHTML = getInfos[num].location;
  currentT.innerHTML = Math.round(
    (parseInt(getInfos[num].minT) + parseInt(getInfos[num].maxT)) / 2
  );

  wxLite(getInfos[num].wxV, weatherP, weatherIMG[0]);

  weatherInfos[0].innerHTML = getInfos[num].pop;
  weatherInfos[1].innerHTML = getInfos[num].ci;
  weatherInfos[2].innerHTML = getInfos[num].wx;
  weatherInfos[3].innerHTML = getInfos[num].minT;
  weatherInfos[4].innerHTML = getInfos[num].maxT;

  date[0].querySelector(".year").innerHTML = dt.getFullYear();
  date[1].querySelector(".month").innerHTML = monthEnglish[dt.getMonth()];
  date[2].querySelector(".day").innerHTML = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
  date[3].querySelector(".week").innerHTML = dayEnglish[dt.getUTCDay()];

  if (infoLength == null) {
    infoLength = getInfos.length;
  }

  mainPage.style.opacity = "1";
  setTimeout("fadeOut(" + num + ")", 10000);
}

//設定第二頁所有顯示的天氣資訊
function setInfos2(num, now = 1) {
  currentNum = num;
  //console.log(num);

  aWeekWeathers();
  writeMsg(now);
  whereLocalWeek();
  secondPage.style.opacity = "1";
}

//判斷晴、陰、雨、雪天
function wxLite(whichData, p = null, img = null) {
  var value = parseInt(whichData);
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
      if (p != null) {
        p.innerHTML = "晴";
      }
      if (img != null) {
        img.style.background = "url(img/sunIMG.svg) no-repeat center";
      }
      break;

    case 7:
    case 8:
    case 9:
    case 10:
      if (p != null) {
        p.innerHTML = "陰";
      }
      if (img != null) {
        img.style.background = "url(img/cloudIMG.svg) no-repeat center";
      }
      break;

    case 42:
      if (p != null) {
        p.innerHTML = "雪";
      }
      if (img != null) {
        img.style.background = "url(img/snowIMG.svg) no-repeat center";
      }
      break;

    default:
      if (p != null) {
        p.innerHTML = "雨";
      }
      if (img != null) {
        img.style.background = "url(img/rainIMG.svg) no-repeat center";
      }
      break;
  }
}

//第二頁設置天氣資訊
function writeMsg(now) {
  localInfos[0].innerHTML = getInfos2[currentNum].wx[now];
  localInfos[1].innerHTML = getInfos2[currentNum].t[now];
  localInfos[2].innerHTML = getInfos2[currentNum].at[now];
  localInfos[3].innerHTML = getInfos2[currentNum].uvi[now];
  localInfos[4].innerHTML = getInfos2[currentNum].rh[now];
  localInfos[5].innerHTML = getInfos2[currentNum].pop12h[now];
  localInfos[6].innerHTML = getInfos2[currentNum].wd[now];

  wxLite(getInfos2[currentNum].wxV[now] * 1, null, weatherIMG[1]);
  //console.log(getInfos2[currentNum]);
}

//第二頁一周輪盤天氣
function aWeekWeathers(grid = null, next = true) {
  let dt2 = new Date();
  var img, p, value;

  //初始算一次未來四天的日期和抓當天的值
  if (grid == null) {
    day = 0;
    for (i = 0; i < oneWeekW.length; i++) {

      dt2.setMonth(dt2.getMonth() + 1);
      dt2.setDate(0);

      img = oneWeekW[i].querySelector(".currentIMG");
      p = oneWeekW[i].querySelectorAll("p");

      wxLite(getInfos2[currentNum].wxV[i] * 1, p[0], img);

      if (dt.getDate() + day > dt2.getDate()) {
        value = dt.getDate() + day - dt2.getDate();
        dt2.setMonth(dt2.getMonth() + 2);
        dt2.setDate(value);
        p[1].innerHTML = `${dt2.getMonth()}/${dt2.getDate()}(${dayChinese[dt2.getUTCDay()]})`;
      } else {
        dt2.setMonth(dt.getMonth());
        dt2.setDate(dt.getDate() + day);
        p[1].innerHTML = `${dt.getMonth() + 1}/${dt2.getDate()}(${dayChinese[dt2.getUTCDay()]})`;
        //console.log(oneWeekW[i].style.top);
      }
      day++;
    }
    day = 1;
  } else {
    //轉一次算一次上一天或下一天的日期和抓當天的值
    dt2.setMonth(dt2.getMonth() + 1);
    dt2.setDate(0);
    var newDay;
    if (!next) {
      newDay = (day - 1 < 0) ? 6 : day - 1;
    } else {
      newDay = (day + 1 > 6) ? 0 : day + 1;
    }

    img = oneWeekW[grid].querySelector(".currentIMG");
    p = oneWeekW[grid].querySelectorAll("p");

    wxLite(getInfos2[currentNum].wxV[newDay] * 1, p[0], img);

    if (dt.getDate() + day > dt2.getDate()) {
      value = dt.getDate() + day - dt2.getDate();
      dt2.setMonth(dt2.getMonth() + 2);
      dt2.setDate(value);
      p[1].innerHTML = `${dt2.getMonth()}/${dt2.getDate()}(${dayChinese[dt2.getUTCDay()]})`;
    } else {
      dt2.setDate(dt.getDate() + newDay);

      p[1].innerHTML = `${dt.getMonth() + 1}/${dt2.getDate()}(${dayChinese[dt2.getUTCDay()]})`;
      //console.log(oneWeekW[i].style.top);
    }
  }
}

//第二頁當前地區一周資訊
function whereLocalWeek() {
  for (i = 0; i < 7; i++) {
    var dayW = {
      wx: getInfos2[currentNum].wx[i],
      t: getInfos2[currentNum].t[i] + "˚C",
      at: getInfos2[currentNum].at[i] + "˚C",
      uvi: getInfos2[currentNum].uvi[i],
      rh: getInfos2[currentNum].rh[i] + "%",
      pop12h: getInfos2[currentNum].pop12h[i] + "%",
      wd: getInfos2[currentNum].wd[i]
    };
    getWeekInfos2.push(dayW);
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
  //鼠標位置
  var x = e.clientX;
  var y = e.clientY;
  //算鼠標到天氣圖的距離
  var directionLX = (x - (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2)) * 5;
  var directionLY = (y - (weatherWrap[i].offsetTop + weatherWrap[i].offsetHeight / 2)) * 5;
  //算從天氣中心到螢幕右邊的距離
  var rightWidth = (window.innerWidth - (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2));

  if (directionLX < 0) {
    eyeLX = directionLX / (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2);
    eyeRX = (directionLX * 2) / (weatherWrap[i].offsetLeft + weatherWrap[i].offsetWidth / 2);
  } else {
    eyeLX =
      (directionLX * 2) / rightWidth;
    eyeRX =
      directionLX / rightWidth;
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
  if (!CorF && current) {
    newValue = Math.round((currentT.innerHTML * 9) / 5 + 32);
    current = false;
  } else if (CorF && !current) {
    newValue = Math.round(((currentT.innerHTML - 32) * 5) / 9);
    current = true;
  } else {
    return;
  }
  currentT.innerHTML = newValue;
}

//第一頁搜尋縣市天氣
function searchW(localValue) {
  //把'台'轉換成'臺'
  localValue = localValue[0] == "台" ? "臺" + localValue.slice(1) : localValue;

  for (i = 0; i < getInfos.length; i++) {
    if (getInfos[i].location == localValue) {
      search = true;
      mainPage.style.opacity = "0";
      setTimeout("setInfos(" + i + ")", 2000);
      clearTimeout(timer);
      timer = setTimeout(function () {
        search = false;
      }, 10000);
    } else {
      continue;
    }
  }
}

//第二頁搜尋地區天氣
function searchW2(localValue) {
  for (i = 0; i < getInfos2.length; i++) {
    if (getInfos2[i].location == localValue) {
      secondPage.style.opacity = "0";
      setTimeout("setInfos2(" + i + ")", 2000);
    } else {
      continue;
    }
  }
}

//第二頁改變日期天氣
function changeW(whatTurn = true) {
  day = whatTurn ? (day - 1 < 0) ? 6 : day - 1 : (day + 1 > 6) ? 0 : day + 1;
  //console.log(day);
  for (i = 0; i < oneWeekW.length; i++) {
    switch (oneWeekW[i].id) {
      case "one":
        if (whatTurn) {
          oneWeekW[i].style.top = 5 + "%";
          oneWeekW[i].style.left = 35 + "%";
          oneWeekW[i].id = "two";
        } else {
          oneWeekW[i].style.top = 55 + "%";
          oneWeekW[i].style.left = 35 + "%";
          oneWeekW[i].id = "four";
        }
        break;

      case "two":
        if (whatTurn) {
          oneWeekW[i].style.top = 30 + "%";
          oneWeekW[i].style.left = 65 + "%";
          oneWeekW[i].id = "three";
        } else {
          oneWeekW[i].style.top = 30 + "%";
          oneWeekW[i].style.left = 5 + "%";
          oneWeekW[i].id = "one";
        }
        break;

      case "three":
        if (whatTurn) {
          oneWeekW[i].style.top = 55 + "%";
          oneWeekW[i].style.left = 35 + "%";
          oneWeekW[i].id = "four";

        } else {
          oneWeekW[i].style.top = 5 + "%";
          oneWeekW[i].style.left = 35 + "%";
          oneWeekW[i].id = "two";
        }
        break;

      case "four":
        if (whatTurn) {
          aWeekWeathers(i, false);
          oneWeekW[i].style.top = 30 + "%";
          oneWeekW[i].style.left = 5 + "%";
          oneWeekW[i].id = "one";
        } else {
          aWeekWeathers(i, true);
          oneWeekW[i].style.top = 30 + "%";
          oneWeekW[i].style.left = 65 + "%";
          oneWeekW[i].id = "three";
        }
        break;
    }
  }
  writeMsg(day);
}