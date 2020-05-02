var CMS = {
  appConfig: {
    language: "zh",
    skin: "res/skin/skin1.png",
    screen: 0
  },
  userConfig: {
  },
  models: [],
  macros: [],
  les: [],
  games: [],
  devices: [],
  deviceID: 0,
  deviceConfig: {
    DriverLEKey: null,
    FuncTable:[],
    UserManual:[]
  },
  profiles: [],
  modelWindow: '',
  stdModeApply: false,
  waterfall: null,
  waterfallEnd: null,
  resdir: 'http://localhost/v6/',
  isLoaded: false
};

var DEVICE = {
  FWVersion: '0',
  modelInfo: {
    ModelID: 0,
    FWID: "",
    Name: "",
    LEType: 0
  },
  profile: null,
  profiles: [],
  currentProfile: null,
  keymap: [],
  leData: {
    Name: '',
    GUID: '',
    Frames: [],
    LEConfigs: []
  },
  que: [],
  lesel: '',
  leeditsel: '',
  lestdindex: 0,
  editKeyCode: '',
  isShowKeySet: true,
  isEditStaticLE: false,
  editStaticLEColor: "#ff0000",
  keylesel: {
    Name: '',
    GUID: ''
  },
  timer: null,
  modeIndex: 1
}

var DefaultProfiles = [];

window.CMS = CMS;
window.DEVICE = DEVICE;
window.DefaultProfiles = DefaultProfiles;

function initApp(){
  (function(){
    return new Promise(function (resolve, reject) {
      readEnvConfig(function(data) {
        CMS.env = data;
        if(CMS.env.debug === 1){
          if(window.location.origin != "http://127.0.0.1:8010")
            window.location = "http://127.0.0.1:8010";
        }
      });
      readAppConfig(function(data) {
        if (data) {
          CMS.appConfig = data;
          if(!CMS.appConfig.Language)
            CMS.appConfig.Language = "zh";
          if(!CMS.appConfig.Skin)
            CMS.appConfig.Skin = "res/skin/skin1.png";
          if(!CMS.appConfig.Screen)
            CMS.appConfig.Screen = 0;
          //updateData();
        }
      });
      //init support models
      readModelList(function(data) {
        CMS.models = data;
        resolve("init APP ok!");
      });
    })
  })().then(function(res){
    //console.log(res);
    //init user config
    return new Promise(function (resolve, reject) {
      readUserConfig(function(data) {
        if (data) {
          CMS.userConfig = data;
        }
        resolve("init UserConfig ok!");
      });
    });
  }).then(function(res){
    //console.log(res);
    //init user data
    return new Promise(function (resolve, reject) {
      initUserData();
      setTimeout(function() {
        resolve("init UserData ok!");
      }, 100);
    });
  }).then(function(res){
    //console.log(res);
    //init devicelist
    return new Promise(function (resolve, reject) {
      //get device list
      getDeviceList(onDeviceListChanged);
      resolve("init Devices ok!");
    });
  }).then(function(res){
    //console.log(res);
    //init lelist
    return new Promise(function (resolve, reject) {
      window.readLEList(function(data){
        window.CMS.les = CMS.les.splice(0,CMS.les.length);
        window.CMS.les = data;
        resolve("init lelist ok!");
      });
    });
  }).then(function(res){
    //console.log(res);
    //init macrolist
    return new Promise(function (resolve, reject) {
      window.readMacroList(function(data){
        window.CMS.macros = CMS.macros.splice(0,CMS.macros.length);
        window.CMS.macros = data;
        resolve("init macrolist ok!");
      });
    });
  }).then(function(res){
    console.log(res);
  })
  getGameList(function(data) {
    CMS.games = data;
  });
  //checkSoftwareUpdate(false);
}

window.initDevice = function(deviceid){
  DEVICE.keymap = [];
  readModelConfig(deviceid, function(data){
    //console.log(data);
    if(data){
      CMS.deviceConfig = data;
    }else{
      CMS.deviceConfig.FuncTable = CMS.deviceConfig.FuncTable.splice(0,CMS.deviceConfig.FuncTable.length);
    }
    if(deviceid == 0 || deviceid == 1){
      window.location = "#" + CMS.deviceConfig.FuncTable[0].component;
    }else{
      window.location = "#" + CMS.deviceConfig.FuncTable[0].component;
    }
  });
  if(deviceid == 0 || deviceid == 1){
    return;
  }
  readModelKeymap(deviceid, function(data){
    DEVICE.keymap = data;
  });
  getModelProfiles(deviceid);
  firmwareUpdateQuery(deviceid, function(data){
    DEVICE.FWVersion = data.FWVersion ? data.FWVersion : '1.0';
  });
  getModelInfoByDid(deviceid);
}

initApp();

window.onload = function(){
  document.getElementById("cms_header").addEventListener('mousedown', function(e){ startDrag(); });
  document.getElementById("cms_footer").addEventListener('mousedown', function(e){ startDrag(); });
  document.body.onselectstart = function(){ return false; }
}
window.isKeySetChange = function() {
  if((JSON.stringify(window.cprofile.KeySet) === JSON.stringify(DEVICE.currentProfile.KeySet)) && (JSON.stringify(window.cprofile.FnKeySet) === JSON.stringify(DEVICE.currentProfile.FnKeySet))) {
    return false;
  }else{
    return true;
  }
}

window.isModeLEChange = function() {
  if(JSON.stringify(window.cprofile.ModeLE) === JSON.stringify(DEVICE.currentProfile.ModeLE)) {
    return false;
  }else{
    return true;
  }
}

window.isStdLEChange = function() {
  if(JSON.stringify(window.cprofile.DriverLE) === JSON.stringify(DEVICE.currentProfile.DriverLE)) {
    return false;
  }else{
    return true;
  }
}


function onDeviceListChanged(devices) {
  //console.log(devices)
  if (CMS.env.debug == 1) {
    openDebugWnd();
    for (var i = 0; i<CMS.models.length; i++) {
      devices.push({ ModelID: CMS.models[i].ModelID });
    }
    devices.push({ ModelID: 0});
    devices.push({ ModelID: 1});
  }
  if(devices[0] && devices[0].ModelID === 655491137){
    devices.splice(0,1);
  }
  if(devices.length == 0){
    devices.push({ ModelID: 1});
  }
  CMS.devices = devices;
  CMS.deviceID = devices[0].ModelID;
}

//初始化用户数据
function initUserData() {
  var isWriteConfig = false;
  if (!CMS.userConfig.UserInit)
    CMS.userConfig.UserInit = {};

  if (!CMS.userConfig.UserInit.Macro) {
    CMS.userConfig.UserInit.Macro = true;
    isWriteConfig = true;

    readDefaultData("res/data/macro/macrolist_"+CMS.appConfig.Language+".json", function(data) {
      var macros = data;
      for (var i = 0; i < macros.length; i++) {
        for (var j = 0; j < macros[i].Data.length; j++) {
          copyMacro(macros[i].Data[j].GUID);
        }
      }
      CMS.macros = data;
      writeMacroList(CMS.macros);
    });
  } else {
    readMacroList(function(json) {
      if(json === 0){
        writeMacroList([]);
        return;
      }
      CMS.macros = json;
      if(CMS.macros.length == 0){
        readDefaultData("res/data/macro/macrolist_"+CMS.appConfig.Language+".json", function(data) {
          var macros = data;
          for (var i = 0; i < macros.length; i++) {
            for (var j = 0; j < macros[i].Data.length; j++) {
              copyMacro(macros[i].Data[j].GUID);
            }
          }
          CMS.macros = data;
          writeMacroList(CMS.macros);
        });
      }else if(CMS.macros[0].Type == 0){
        var usermacros = JSON.parse(JSON.stringify(CMS.macros));
        readDefaultData("res/data/macro/macrolist_"+CMS.appConfig.Language+".json", function(data) {
          var macros = data;
          for (var i = 0; i < macros.length; i++) {
            for (var j = 0; j < macros[i].Data.length; j++) {
              copyMacro(macros[i].Data[j].GUID);
            }
          }
          CMS.macros = data;
          var nocate = {};
          nocate.Name = "未分类";
          nocate.Type = 1;
          nocate.IconSrc = "macro_icon_default_folder";
          nocate.Data = usermacros;
          CMS.macros.push(nocate);
          writeMacroList(CMS.macros);
        });
      }
    });
  }


  if (!CMS.userConfig.UserInit.LE) {
    CMS.userConfig.UserInit.LE = true;
    isWriteConfig = true;

    readDefaultData("res/data/le/lelist_"+CMS.appConfig.Language+".json", function(data) {
      for (var i = 0; i < data.length; i++) {
        copyLE(data[i].GUID);
      }
      CMS.les = data;
      writeLEList(CMS.les);
    });
  } else {
    readLEList(function(json) {
      CMS.les = json;
    });
  }
  isWriteConfig && writeUserConfig(CMS.userConfig);
}

//初始化机型profile
window.getModelProfiles = function(modelID){
  DEVICE.profiles = [];
  getProfileList(modelID, function(profiles) {
    DEVICE.profiles = profiles;
    getDefaultProfiles(function(){initProfiles(true)});
  });
}
//初始化机型profile
function initModelData(modelID) {
  var isWriteConfig = false;
  if (!CMS.userConfig.ModelInit)
    CMS.userConfig.ModelInit = {};
  if (!CMS.userConfig.ModelInit[modelID])
    CMS.userConfig.ModelInit[modelID] = {};
  if (!CMS.userConfig.ModelInit[modelID].Macro) {
    CMS.userConfig.ModelInit[modelID].Macro = true;
    isWriteConfig = true;
  }
  if (!CMS.userConfig.ModelInit[modelID].LE) {
    CMS.userConfig.ModelInit[modelID].LE = true;
    isWriteConfig = true;
  }
  if (!CMS.userConfig.ModelInit[modelID].Mode) {
    CMS.userConfig.ModelInit[modelID].Mode = 1;
    isWriteConfig = true;
  }
  isWriteConfig && writeUserConfig(CMS.userConfig);
}

window.getDefaultProfiles= function(callback){
  DEVICE.que = [];
  DEVICE.pcount = 0;
  readDefaultProfile('profile', 0);
  readDefaultProfile('profile_offline_std', 1);
  readDefaultProfile('profile_offline_1', 2);
  readDefaultProfile('profile_offline_2', 3);
  readDefaultProfile('profile_offline_3', 4);
  readDefaultProfile('profile_online_1', 5);
  readDefaultProfile('profile_online_2', 6);
  readDefaultProfile('profile_online_3', 7);
  var pcintv = setInterval(function(){
    if(DEVICE.pcount === 8){
      callback && callback();
      clearInterval(pcintv);
    }
  },20);
}

function readDefaultProfile(pname, index){
  readModelProfile(CMS.deviceID, pname, function(data) {
    DefaultProfiles[index] = data;
    DEVICE.pcount++;
    DEVICE.que.push(index);
  });
}

function initProfiles(bApply){
  if(DEVICE.profiles.length > 1){
    if(DEVICE.profiles[0].ModeIndex == 0){
      window.deleteProfile(CMS.deviceID, DEVICE.profiles[0].GUID, function(){
        DEVICE.profiles.splice(0,1);
      });
    }
    return;
  }else if(DEVICE.profiles.length == 1){
    DEVICE.profiles = [];
    window.deleteProfile(CMS.deviceID, DEVICE.profiles[0].GUID, function(){
      console.log("reset profiles ok!");
    });
  }
  for (var i = 1; i < DefaultProfiles.length; i++) {
    var newProfile = null;
    if(DefaultProfiles[i]){
      newProfile = JSON.parse(JSON.stringify(DefaultProfiles[i]));
      newProfile.GUID = getGuid();
      newProfile.Index = i;
      if (i < 5)
        newProfile.ModeIndex = i;
      else
        newProfile.ModeIndex = 0;
      if (i == 1)
        newProfile.Name = "layer_std";
      else if (i < 5)
        newProfile.Name = "layer_onboard_" + (i-1);
      else
        newProfile.Name = "layer_driver_" + (i-4);
      if (i == 1) {
        var stdProfile = {};
        stdProfile.Index = 1;
        stdProfile.GUID = newProfile.GUID;
        stdProfile.ModeIndex = newProfile.ModeIndex;
        stdProfile.Name = newProfile.Name;
        stdProfile.Active = newProfile.Active;
        stdProfile.DriverLE = newProfile.DriverLE;
        if(newProfile.hasOwnProperty('KeySet'))
          stdProfile.KeySet = newProfile.KeySet;
        newProfile = stdProfile;
      }
      if ((i === 1) && (CMS.deviceConfig.DeviceCate === 2)) {
        continue;
      }
      (function(profile) {
        writeProfile(CMS.deviceID, profile.GUID, profile, function() {
          var item = {
            Active: profile.Active,
            GUID: profile.GUID,
            ModeIndex: profile.ModeIndex,
            Name: profile.Name,
            Application: profile.Application
          }
          DEVICE.profiles.push(item);
          if (!bApply && (profile.ModeIndex == 0) && (profile.Active == 1))
            console.log("change to online 1");
          if(bApply && (profile.ModeIndex != 0)) {
            apply(CMS.deviceID, profile.GUID, function(result) {
              if(result) {
                console.log("apply success");
              } else {
                console.log("apply error");
              }
            });
          }
        });
      })(newProfile);
    }
  }
  initModelData(CMS.deviceID);
}


window.restoreLayer = function(mIndex,bApply) {
  return new Promise(function (resolve, reject) {
    var newProfile = null;
    newProfile = JSON.parse(JSON.stringify(DefaultProfiles[mIndex]));
    if (mIndex < 5){
      newProfile.ModeIndex = mIndex;
    }else{
      newProfile.ModeIndex = 0;
    }
    newProfile.GUID = DEVICE.profiles[mIndex-1].GUID;
    if (mIndex == 1)
      newProfile.Name = "layer_std";
    else if (mIndex < 5)
      newProfile.Name = "layer_onboard_" + (mIndex-1);
    else
      newProfile.Name = "layer_driver_" + (mIndex-4);
    if (mIndex == 1) {
      var stdProfile = {};
      stdProfile.GUID = newProfile.GUID;
      stdProfile.ModeIndex = newProfile.ModeIndex;
      stdProfile.Name = newProfile.Name;
      stdProfile.Active = newProfile.Active;
      stdProfile.DriverLE = newProfile.DriverLE;
      if(newProfile.hasOwnProperty('KeySet'))
        stdProfile.KeySet = newProfile.KeySet;
      newProfile = stdProfile;
    }
    newProfile.Index = mIndex;
    writeProfile(CMS.deviceID, newProfile.GUID, newProfile, function() {
      if(bApply){
        apply(CMS.deviceID, DEVICE.profiles[mIndex-1].GUID, function(result) {
          if(result) {
            //resolve("restore profile " + mIndex + " success");
            resolve("2");
          } else {
            //resolve("apply profile " + mIndex + " error");
            resolve("0");
          }
        });
      }else{
        //resolve("write profile " + mIndex + " success");
        resolve("1");
      }
    });
  });
}

window.clearLayer = function(mIndex,bApply) {
  return new Promise(function (resolve, reject) {
    var profile = null;
    if (mIndex == 1){
      profile = JSON.parse(JSON.stringify(DefaultProfiles[1]));
      DEVICE.currentProfile.DriverLE = profile.DriverLE;
      for(var i=0;i<DEVICE.currentProfile.DriverLE.length;i++){
        DEVICE.currentProfile.DriverLE[i].Name = "";
        DEVICE.currentProfile.DriverLE[i].GUID = "";
      }
    }else{
      profile = JSON.parse(JSON.stringify(DefaultProfiles[0]));
      DEVICE.currentProfile.KeySet = profile.KeySet;
    }
    writeProfile(CMS.deviceID, DEVICE.currentProfile.GUID, DEVICE.currentProfile, function() {
      if(bApply){
        apply(CMS.deviceID, DEVICE.currentProfile.GUID, function(result) {
          if(result) {
            resolve("2");
          } else {
            resolve("0");
          }
        });
      }else{
        resolve("1");
      }
    });
  });
}

window.restoreProfiles = function(bApply, callback){
  restoreLayer(1,bApply).then(function(res){
    DEVICE.modeIndex = 1;
    callback && callback(1);
    return restoreLayer(2,bApply);
  }).then(function(res){
    DEVICE.modeIndex = 2;
    callback && callback(2);
    return restoreLayer(3,bApply);
  }).then(function(res){
    DEVICE.modeIndex = 3;
    callback && callback(3);
    return restoreLayer(4,bApply);
  }).then(function(res){
    DEVICE.modeIndex = 4;
    callback && callback(4);
    setTimeout(function(){
      DEVICE.modeIndex = 1;
    },500);
  })
}

window.getProfileGuidByModeIndex = function(modeindex, callback){
  for(let i=0;i<DEVICE.profiles.length;i++){
    if(DEVICE.profiles[i].ModeIndex === modeindex){
      callback && callback(DEVICE.profiles[i].GUID);
      return;
    }
  }
  callback && callback(DEVICE.profiles[0].GUID);
}

window.getModelInfoByDid = function(did){
  for(let i=0;i<CMS.models.length;i++){
    if(CMS.models[i].ModelID === did){
      DEVICE.modelInfo = JSON.parse(JSON.stringify(CMS.models[i]));
      return;
    }
  }
}

window.getDefaultKeySetByLcode = function(lcode, callback){
  for(let i=0;i<DefaultProfiles[0].KeySet.length;i++){
    if(DefaultProfiles[0].KeySet[i].Index === lcode){
      callback && callback(JSON.parse(JSON.stringify(DefaultProfiles[0].KeySet[i])));
    }
  }
}

window.getAllLocationCodes = function(){
  var alllcodes = [];
  for(var i=0;i<DEVICE.keymap.length;i++){
    if(DEVICE.keymap[i].LocationCode != -1){
      alllcodes.push(DEVICE.keymap[i].LocationCode);
    }
  }
  return alllcodes;
}