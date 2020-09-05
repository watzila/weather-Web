//全部縣市個別天氣資訊
var dataOK = [];

//要連接JOSN的網址
var requestURL =
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-422B0FA3-E374-492D-B54A-4D8942BE2B7E&format=JSON";
//創建新的伺服器連結
var request = new XMLHttpRequest();
//請求伺服器連結，requestURL是上面宣告的網址
request.open("get", requestURL);
//得到的資料已JSON格式解讀
request.responseType = "json";
//獲得所有資料
request.send();
//載入資料到自己設定的地方，onload會等所有資料載入完自動執行
request.onload = function () {
  var taiwanWeathers = request.response;
  locationInfos(taiwanWeathers);
};

//整理各縣市的個別資料
function locationInfos(taiwanWeathers) {
  var infoLs = taiwanWeathers["records"].location;
  for (i = 0; i < infoLs.length; i++) {
    var wxs = infoLs[i].weatherElement;
    var data = {
      location: infoLs[i].locationName,
      wx: wxs[0].time[0].parameter.parameterName,
      wxV: wxs[0].time[0].parameter.parameterValue,
      pop: wxs[1].time[0].parameter.parameterName,
      minT: wxs[2].time[0].parameter.parameterName,
      ci: wxs[3].time[0].parameter.parameterName,
      maxT: wxs[4].time[0].parameter.parameterName,
    };

    dataOK.push(data);
    //console.log(wxs[0]);
  }
  //console.log(dataOK);
  updateInfos(dataOK);
  setInfos(11);
}

var monthEnglish = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOber",
  "NOVEMBER",
  "DECEMBER",
];

var dayEnglish = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
var dayChinese = ["日", "一", "二", "三", "四", "五", "六"];
