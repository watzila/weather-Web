//全部台中市區個別天氣資訊
var dataOK2 = [];

//要連接JOSN的網址
var requestURL2 =
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-075?Authorization=CWB-422B0FA3-E374-492D-B54A-4D8942BE2B7E&format=JSON";
//創建新的伺服器連結
var request2 = new XMLHttpRequest();
//請求伺服器連結，requestURL是上面宣告的網址
request2.open("get", requestURL2);
//得到的資料已JSON格式解讀
request2.responseType = "json";
//獲得所有資料
request2.send();
//載入資料到自己設定的地方，onload會等所有資料載入完自動執行
request2.onload = function () {
  var localWeathers = request2.response;
  locatInfos2(localWeathers);
};

//整理各區的個別資料
function locatInfos2(localWeathers) {
  var infoLs2 = localWeathers["records"].locations[0].location;
  for (i = 0; i < infoLs2.length; i++) {
    var localW = infoLs2[i].weatherElement;

    var data2 = {
      location: infoLs2[i].locationName,
      wx: getWeekWeather(localW[6]),
      wxV: getWeekWeather(localW[6], 3),
      t: getWeekWeather(localW[1]),
      at: getWeekBodyT(localW[11], localW[5]),
      uvi: getWeekWeather(localW[9], 2),
      rh: getWeekWeather(localW[2]),
      pop12h: getWeekWeather(localW[0]),
      wd: getWeekWeather(localW[13]),
    };

    dataOK2.push(data2);
    //console.log(wxs[0]);
  }
  console.log(dataOK2);
  console.log(infoLs2);
  updateInfos2(dataOK2);
  setInfos2(25);
}

//計算一個禮拜的當前平均體感溫度
function getWeekBodyT(minT, maxT) {
  var infosOK = [];
  for (j = 0; j < minT.time.length; j++) {
    if (j % 2 == 0) {
      var min = parseInt(minT.time[j].elementValue[0].value);
      var max = parseInt(maxT.time[j].elementValue[0].value);
      infosOK.push(Math.round((min + max) / 2));
    } else {
      continue;
    }
  }
  return infosOK;
}

//取出一個禮拜的當前資料
function getWeekWeather(whatInfo, type = 1) {
  var infosOK = [];
  switch (type) {
    case 1:
      for (j = 0; j < whatInfo.time.length; j++) {
        if (j % 2 == 0) {
          var thisInfo = whatInfo.time[j].elementValue[0].value;
          infosOK.push(thisInfo);
        } else {
          continue;
        }
      }
      return infosOK;
      break;

    case 2:
      for (j = 0; j < whatInfo.time.length; j++) {
        var thisInfo = whatInfo.time[j].elementValue[1].value;
        infosOK.push(thisInfo);
      }
      return infosOK;
      break;

    case 3:
      for (j = 0; j < whatInfo.time.length; j++) {
        if (j % 2 == 0) {
          var thisInfo = whatInfo.time[j].elementValue[1].value;
          infosOK.push(thisInfo);
        } else {
          continue;
        }
      }
      return infosOK;
      break;
  }
}
