
window.cms = {
  accountID: 0,
}

window.callCMS = function(name, param, onSuccess, onFailure) {
  var request = { funcname: name };
  for(var i in param) request[i] = param[i];
  var data = { request: JSON.stringify(request) };
  onSuccess && (data.onSuccess = onSuccess);
  data.onFailure = function(code, message) {
    if (onFailure)
      onFailure(code, message);
    console.log('Call CMS failure! code: ' + code + ', message: ' + message);
  };
  window.callFunc(data);
}

window.onCMS = function(name, onFunc) {
  window.onFunc(name, onFunc);
}

window.profileActive = function(onProfileActive) {
  if(onProfileActive) {
    onCMS('onProfileActive', function(data) {
      var jsonData = JSON.parse(data);
      onProfileActive(jsonData);
    });
  }
}

window.dpiChanged = function(ondpiChanged)
{
  onCMS('onDpiChanged',function(data) {
      var dpiData = JSON.parse(data);
      ondpiChanged&&ondpiChanged(dpiData);

  })
}

window.sensorCheck = function(modelID, onSensorResult) {
  if(onSensorResult) {
    onCMS('onSensorResult', function(data) {
      var sensorData = JSON.parse(data);
      onSensorResult(sensorData);
    });
  var param = {
    ModelID:modelID
  };
    callCMS('StartSensorCheck',param);
  }
}

window.softwareUpdateQuery = function(onSoftwareUpdateQuery) {
  if(onSoftwareUpdateQuery) {
    onCMS('onSoftwareUpdateQuery', function(data) {
      var suqData = JSON.parse(data);
      onSoftwareUpdateQuery(suqData);
    });
    callCMS('SoftwareUpdateQuery');
  }
}

window.softwareUpdate = function(file, onSoftwareUpdate) {
  if(onSoftwareUpdate) {
    onCMS('onSoftwareUpdate', function(data) {
      var suData = JSON.parse(data);
      onSoftwareUpdate(suData);
    });
    var param = {
      File: file,
    };
    callCMS('SoftwareUpdate', param);
  }
}

window.firmwareUpdateQuery = function(modelID, onFirmwareUpdateQuery) {
  if(onFirmwareUpdateQuery) {
    onCMS('onUpdateFirmwareMessage', function(data) {
      var fuqData = JSON.parse(data);
      onFirmwareUpdateQuery(fuqData);
    });
    var param = {
      ModelID: modelID,
    };
    callCMS('QueryFirmwareUpdateInfo', param);
  }
}

window.firmwareUpdate = function(modelID, version, onFirmwareUpdate) {
  if(onFirmwareUpdate) {
    onCMS('onUpdateFirmwareProccess', function(data) {
      var jsonData = JSON.parse(data);
      onFirmwareUpdate(jsonData);
    });
    var param = {
      ModelID: modelID,
      FWVersion: version,
    };
    callCMS('UpdateFirmware', param);
  }
}

window.getGameList = function(onGameListChanged) {
  if(onGameListChanged) {
    onCMS('onGameListChanged', function(data) {
      var devices = JSON.parse(data);
      if(devices === null)
        onGameListChanged([]);
      else
        onGameListChanged(devices);
    });
  }
  callCMS('GetGameList');
}

window.getDeviceList = function(onDeviceListChanged) {
  if(onDeviceListChanged) {
    onCMS('onDeviceListChanged', function(data) {
      var devices = JSON.parse(data);
      console.log(devices)
      if(devices === null)
        onDeviceListChanged([]);
      else
        onDeviceListChanged(devices);
    });
  }
  callCMS('GetDeviceList');
}

window.getProfileList = function(modelID, onProfileList) {
  if(onProfileList) {
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
    };
    callCMS('GetProfileList', param, function(data) {
      var profiles = JSON.parse(data);
      if(profiles === null)
        onProfileList([]);
      else
        onProfileList(profiles);
    });
  }
}

window.readProfile = function(modelID, guid, onReadProfile) {
  if(onReadProfile) {
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
      GUID: guid,
    }
    callCMS('ReadProfile', param, function(data) {
      var profile = JSON.parse(data);
        onReadProfile(profile);
    });
  }
}

window.writeProfile = function(modelID, guid, profile, onWriteProfile) {
  if(onWriteProfile) {
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
      GUID: guid,
      Data: JSON.stringify(profile),
    }
    callCMS('WriteProfile', param, function() {
      onWriteProfile();
    });
  }
}

window.deleteProfile = function(modelID, guid, onDeleteProfile) {
  if(onDeleteProfile) {
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
      GUID: guid,
    }
    callCMS('DeleteProfile', param,
      function() {
        onDeleteProfile(true);
      },
      function() {
        onDeleteProfile(false);
      });
  }
}

window.changeCurrentProfile = function(modelID, newGUID, oldGUID, onChangeProfile) {
  if(onChangeProfile) {
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
      NewGUID: newGUID,
      OldGUID: oldGUID,
    }
    callCMS('ChangeCurrentProfile', param, function() {
      onChangeProfile();
    });
  }
}

window.onProfileActive = function(onProfileActiveCallBack) {
  if(onProfileActiveCallBack) {
    onCMS('onProfileActive', function(data) {
      var activeProfile = JSON.parse(data);
      onProfileActiveCallBack(activeProfile);
    });
  }
}

window.changeMode = function(modelID, modeIndex) {
  if (modeIndex) {
    var param = {
      ModelID: modelID,
      ModeIndex: modeIndex,
    }
    callCMS('ChangeMode', param);
  }
}

window.apply = function(modelID, guid, onApply) {
  if (onApply) {
    onCMS('onApplyResult', function(data) {
      var result = JSON.parse(data);
      if (result.result != 1)
        onApply(false);
      else
        onApply(true);
    });
    var param = {
      AccoutID: cms.accountID,
      ModelID: modelID,
      GUID: guid,
    }
    callCMS('ApplyConfig', param);
  }
}

window.getMacroList = function(onMacroList) {
  if(onMacroList) {
    var param = {
      AccoutID: cms.accountID,
    };
    callCMS('GetMacroList', param, function(data) {
      var macros = JSON.parse(data);
      if(macros === null)
        onMacroList([]);
      else
        onMacroList(macros);
    });
  }
}

window.readMacroFile = function(guid, onReadMacroFile) {
  if(onReadMacroFile) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
    }
    callCMS('ReadMacrofile', param, function(data) {
      var macro = JSON.parse(data);
        onReadMacroFile(macro);
    });
  }
}

window.writeMacroFile = function(guid, macro, onWriteMacroFile) {
  if(onWriteMacroFile) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
      Data: JSON.stringify(macro),
    }
    callCMS('WriteMacrofile', param, function() {
      onWriteMacroFile();
    });
  }
}

window.deleteMacrofile = function(guid, onDeleteMacrofile) {
  if(onDeleteMacrofile) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
    }
    callCMS('DeleteMacrofile', param,
      function() {
        onDeleteMacrofile(true);
      },
      function() {
        onDeleteMacrofile(false);
      });
  }
}

window.getLEList = function(onLEList) {
  if(onLEList) {
    var param = {
      AccoutID: cms.accountID,
    };
    callCMS('GetLEList', param, function(data) {
      var les = JSON.parse(data);
      if(les === null)
        onLEList([]);
      else
        onLEList(les);
    });
  }
}

window.readLE = function(guid, onReadLE) {
  if(onReadLE) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
    }
    callCMS('ReadLE', param, function(data) {
      var le = JSON.parse(data);
      onReadLE(le);
    });
  }
}

window.writeLE = function(guid, le, onWriteLE) {
  if(onWriteLE) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
      Data: JSON.stringify(le),
    }
    callCMS('WriteLE', param, function() {
      onWriteLE();
    });
  }
}

window.deleteLE = function(guid, onDeleteLE) {
  if(onDeleteLE) {
    var param = {
      AccoutID: cms.accountID,
      GUID: guid,
    }
    callCMS('DeleteLE', param,
      function() {
        onDeleteLE(true);
     },
     function() {
        onDeleteLE(false);
     });
  }
}

window.startHotKey = function(onHotKey) {
  if (onHotKey) {
    onCMS('onHotKeyDown', function(data) {
      var hotkey = JSON.parse(data);
      onHotKey(hotkey);
    });
    callCMS('StartHotKey');
  }
}

window.stopHotKey = function() {
  callCMS('StopHotKey');
}

window.startRecord = function() {
  callCMS('StartRecord');
}

window.listenStopMakeMacro = function(isEnterStopButton) {
  var param = {
    "SetRecordBtn":isEnterStopButton
  }
  callCMS('SetRecordBtn', param, function(data) {
    console.log('listenStopMakeMacro', isEnterStopButton);
  });

}

window.stopRecord = function() {
  callCMS('StopRecord');
}

window.onKeyDown = function(onKeyDownCallBack) {
  onCMS('onKeyDown', function(data) {
    onKeyDownCallBack(data);
  });
}

window.onKeyUp = function(onKeyUpCallBack) {
  onCMS('onKeyUp', function(data) {
    onKeyUpCallBack(data);
  });
}

window.onDelay = function(onDelayCallBack) {
  onCMS('onDelay', function(data) {
    onDelayCallBack(data);
  });
}

window.onMouseDown = function(onMouseDownCallBack) {
  onCMS('onMouseDown', function(data) {
    onMouseDownCallBack(data);
  });
}

window.onMouseUp = function(onMouseUpCallBack) {
  onCMS('onMouseUp', function(data) {
    onMouseUpCallBack(data);
  });
}

window.openFileDialog = function(onOpenFileDialog) {
  callCMS('OpenFileDialog', {}, function(data) {
    data = data.replace(/\\/g, "/");
    onOpenFileDialog(data);
  });
}

window.openFileDialogEx = function(onOpenFileDialogEx) {
  callCMS('OpenFileDialogEx', {}, function(data) {
    data = data.replace(/\\/g, "/");
    onOpenFileDialogEx(data);
  });
}

window.readEnvConfig = function(onReadEnvConfig) {
  if (onReadEnvConfig) {
    var param = {
      Type: 0,
      Path: 'Env.json'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadEnvConfig(config);
    });
  }
}

window.readModelList = function(onReadModelList) {
  if (onReadModelList) {
    var param = {
      Type: 0,
      Path: 'device/modellist.json'
    }
    callCMS('ReadFile', param, function(data) {
      var modellist = JSON.parse(data);
      onReadModelList(modellist);
    });
  }
}

window.readModelKeymap = function(modelID, onReadModelKeymap, keymapindex='') {
  if (onReadModelKeymap) {
    var param = {
      Type: 0,
      Path: 'device/' + modelID + '/data/keymap' + keymapindex + '.js'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadModelKeymap(config);
    });
  }
}

window.readModelProfile = function(modelID, name, onReadModelProfile) {
  if (onReadModelProfile) {
    var param = {
      Type: 0,
      Path: 'device/' + modelID + '/data/' + name + '.json'
    }
    callCMS('ReadFile', param,
      function(data) {
        var profile = JSON.parse(data);
        onReadModelProfile(profile);
      },
      function(code, message) {
        onReadModelProfile(null);
      }
    );
  }
}

window.readAppConfig = function(onReadAppConfig) {
  if (onReadAppConfig) {
    var param = {
      Type: 1,
      Path: 'AppConfig.json'
    }
    callCMS('ReadFile', param,
      function(data) {
        var config = JSON.parse(data);
        onReadAppConfig(config);
      },
      function(code, message) {
        onReadAppConfig(null);
      }
    );
  }
}

window.writeAppConfig = function(config, onWriteAppConfig) {
  var param = {
    Type: 1,
    Path: 'AppConfig.json',
    Data: JSON.stringify(config),
  }
  callCMS('WriteFile', param, function() {
    onWriteAppConfig && onWriteAppConfig();
  });
}

window.readUserConfig = function(onReadUserConfig) {
  if (onReadUserConfig) {
    var param = {
      Type: 1,
      Path: 'Account/' + cms.accountID + '/Config.json',
    }
    callCMS('ReadFile', param,
      function(data) {
        var config = JSON.parse(data);
        onReadUserConfig(config);
      },
      function(code, message) {
        onReadUserConfig(null);
      }
    );
  }
}

window.writeUserConfig = function(config, onWriteUserConfig) {
  var param = {
    Type: 1,
    Path: 'Account/' + cms.accountID + '/Config.json',
    Data: JSON.stringify(config),
  }
  callCMS('WriteFile', param, function() {
    onWriteUserConfig && onWriteUserConfig();
  });
}

window.readMacroList = function(onReadMacroList) {
  if (onReadMacroList) {
    var param = {
      Type: 1,
      Path: 'Account/' + cms.accountID + '/Macro/' + 'macrolist.json'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadMacroList(config);
    }, function(code,msg) {
      onReadMacroList(0);
    });
  }
}

window.writeMacroList = function(macrolist, onWriteMacroList) {
  var param = {
    Type: 1,
    Path: 'Account/' + cms.accountID + '/Macro/' + 'macrolist.json',
    Data: JSON.stringify(macrolist),
  }
  callCMS('WriteFile', param, function() {
    onWriteMacroList && onWriteMacroList();
  });
}

window.readDefaultLEList = function(onReadLEList) { 
  if (onReadLEList) {
    var param = {
      Type: 0,
      Path: 'res/data/le/lelist_' + CMS.appConfig.Language + '.json'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadLEList(config);
    });
  }
}

window.translateLelist = function(){
  new Promise(function (resolve, reject) {
    readDefaultLEList(function(data){
      for(var i=0;i<data.length;i++){
        for(var j=0;j<CMS.les.length;j++){
          if(data[i].GUID == CMS.les[j].GUID){
            CMS.les[j].Name = data[i].Name;
          }
        }
      }
      writeLEList(CMS.les, function(){
        resolve(111);
      });
    });
  }).then(function(res){
    translateStdLelist();
    console.log(res);
  })
}

window.translateStdLelist = function(){
  if(DEVICE.currentProfile.ModeIndex != 1) return;
  for(var i=0;i<DEVICE.currentProfile.DriverLE.length;i++){
    for(var j=0;j<CMS.les.length;j++){
      if(DEVICE.currentProfile.DriverLE[i].GUID == CMS.les[j].GUID){
        DEVICE.currentProfile.DriverLE[i].Name = CMS.les[j].Name;
      }
    }
  }
}



window.readLEList = function(onReadLEList) {
  if (onReadLEList) {
    var param = {
      Type: 1,
      Path: 'Account/' + cms.accountID + '/LE/' + 'lelist.json'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadLEList(config);
    });
  }
}

window.writeLEList = function(lelist, onWriteLEList) {
  var param = {
    Type: 1,
    Path: 'Account/' + cms.accountID + '/LE/' + 'lelist.json',
    Data: JSON.stringify(lelist),
  }
  callCMS('WriteFile', param, function() {
    onWriteLEList && onWriteLEList();
  });
}

window.copyMacro = function(guid, onCopyMacro) {
  var param = {
    SrcPath: 'res/data/macro/' + guid + '.cms',
    DestPath: 'Account/' + cms.accountID + '/Macro/' + guid + '.cms',
  }
  callCMS('CopyFile', param, function() {
    onCopyMacro && onCopyMacro();
  });
}

window.copyLE = function(guid, onCopyLE) {
  var param = {
    SrcPath: 'res/data/le/' + guid + '.le',
    DestPath: 'Account/' + cms.accountID + '/LE/' + guid + '.le',
  }
  callCMS('CopyFile', param, function() {
    onCopyLE && onCopyLE();
  });
}

window.copyModelMacro = function(modelID, guid, onCopyMacro) {
  var param = {
    SrcPath: 'device/' + modelID + '/data/macro/' + guid + '.cms',
    DestPath: 'Account/' + cms.accountID + '/Macro/' + guid + '.cms',
  }
  callCMS('CopyFile', param, function() {
    onCopyMacro && onCopyMacro();
  });
}

window.copyModelLE = function(modelID, guid, onCopyLE) {
  var param = {
    SrcPath: 'device/' + modelID + '/data/le/' + guid + '.le',
    DestPath: 'Account/' + cms.accountID + '/LE/' + guid + '.le',
  }
  callCMS('CopyFile', param, function() {
    onCopyLE && onCopyLE();
  });
}

window.importLE = function(onImportLE) {
  var param = {
  }
  callCMS('ImportLightfile', param, function(data) {
    onImportLE && onImportLE(data);
  });
}

window.exportLE = function(le, onExportLE) {
  var param = {
    JsonLightfile: JSON.stringify(le),
  }
  callCMS('ExportLightfile', param, function(data) {
    onExportLE && onExportLE(data);
  });
}

window.minimizeCMSUI = function() {
  callCMS('MiniSizeWnd');
}

window.closeCMSUI = function() {
  callCMS('CloseWnd');
}

window.openURL = function(url) {
  callCMS('OpenURL', { URL: url });
}

window.openDebugWnd = function() {
  callCMS('OpenDebugWnd');
}

window.startDrag = function() {
  CMSDesktop.startDrag();
}

window.importMacro = function(onImportMacro) {
  var param = {
  }
  callCMS('ImportMacrofile', param, function(data) {
    onImportMacro && onImportMacro(data);
  });
}

window.exportMacro = function(macrodata, onExportMacro) {
  var param = {
    JsonMacrofile: JSON.stringify(macrodata),
  }
  callCMS('ExportMacrofile', param, function(data) {
    onExportMacro && onExportMacro(data);
  });
}

window.readLEMolding = function(modelID, onReadLEMolding) {
  if (onReadLEMolding) {
    var param = {
      Type: 1,
      Path: 'Account/' + cms.accountID + '/Devices/' + modelID + '/ledkeymap.json',
    }
    callCMS('ReadFile', param,
      function(data) {
        var ledkeymap = JSON.parse(data);
        onReadLEMolding(ledkeymap);
      },
      function() {
        onReadLEMolding(null);
      }
    );
  }
}

window.writeLEMolding = function(leMoldingData, modelID, onWriteLEMolding) {
  var param = {
    Type: 1,
    Path: 'Account/' + cms.accountID + '/Devices/' + modelID + '/ledkeymap.json',
    Data: JSON.stringify(leMoldingData),
  }
  callCMS('WriteFile', param, function() {
    onWriteLEMolding && onWriteLEMolding();
  });
}

window.isSupportDevice = function(modelID) {
  var support = false;
  for(var i = 0; i < CMS.models.length; i++) {
    if (CMS.models[i].ModelID == modelID)
      support = true;
  }
  return support;
}

window.readModelConfig = function(modelID, onReadModelConfig) {
  if (onReadModelConfig) {
    var param = {
      Type: 0,
      Path: 'device/' + modelID + '/config.json'
    }
    callCMS('ReadFile', param, function(data) {
      var config = JSON.parse(data);
      onReadModelConfig(config);
    },function(err){console.log("no file read!");});
  }
}

window.readDefaultData = function(localpath, onReadDefaultData) {
  if (onReadDefaultData) {
    var param = {
      Type: 0,
      Path: localpath
    }
    callCMS('ReadFile', param, function(data) {
      var jsondata = JSON.parse(data);
      onReadDefaultData(jsondata);
    });
  }
}


window.$ = function(id){
  return document.getElementById(id);
}
window.siblings = function(obj){
  var a = [];
  var p = obj.parentNode.children;
  for(var i = 0; i < p.length; i++){
    if(p[i].nodeType == 1 && p[i] != obj){
      a.push(p[i]);
    }
  } 
  return a;
}
window.removeClass = function(els, classname){
  for(var j = 0; j < els.length; j++){
    els[j].classList.remove(classname);
  }
}
window.getStyle = function(el, name) {
  if(window.getComputedStyle) {
    return window.getComputedStyle(el, name);
  }else{
    return el.currentStyle;
  }
}

/********************color functions*********************/
window.colorR = function(color) {
  var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  var regColor16 = /^0x([0-9a-fA-F]{6})$/;
  color = color.toLowerCase();
  if (regColorJS.test(color)) {
    if (color.length === 4) {
      var colorNew = "#";
      for (var i=1; i<4; i+=1) {
        colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
      }
      color = colorNew;
    }

    return parseInt("0x" + color.slice(1, 3));
  } else if (regColor16.test(color)) {
    return parseInt("0x" + color.slice(2, 4));
  }
  return null;
}

window.colorG = function(color) {
  var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  var regColor16 = /^0x([0-9a-fA-F]{6})$/;
  color = color.toLowerCase();
  if (regColorJS.test(color)) {
    if (color.length === 4) {
      var colorNew = "#";
      for (var i=1; i<4; i+=1) {
        colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
      }
      color = colorNew;
    }

    return parseInt("0x" + color.slice(3, 5));
  } else if (regColor16.test(color)) {
    return parseInt("0x" + color.slice(4, 6));
  }
  return null;
}

window.colorB = function(color) {
  var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  var regColor16 = /^0x([0-9a-fA-F]{6})$/;
  color = color.toLowerCase();
  if (regColorJS.test(color)) {
    if (color.length === 4) {
      var colorNew = "#";
      for (var i=1; i<4; i+=1) {
        colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
      }
      color = colorNew;
    }

    return parseInt("0x" + color.slice(5, 7));
  } else if (regColor16.test(color)) {
    return parseInt("0x" + color.slice(6, 8));
  }
  return null;
}

window.toJS = function(color) {
  var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  var regColor16 = /^0x([0-9a-fA-F]{6})$/;
  color = color.toLowerCase();
  if (regColorJS.test(color))
    return color;
  if (regColor16.test(color)) {
    var colorNew = "#";
    colorNew += color.slice(2, 8);
    color = colorNew;
    return color;
  }
  return null;
}

window.to16 = function(color) {
  var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  var regColor16 = /^0x([0-9a-fA-F]{6})$/;
  color = color.toLowerCase();
  if (regColor16.test(color))
    return color;
  if (regColorJS.test(color)) {
    if (color.length === 4) {
      var colorNew = "#";
      for (var i=1; i<4; i+=1) {
        colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
      }
      color = colorNew;
    }
    var colorNew = "0x";
    colorNew += color.slice(1, 7);
    color = colorNew;
    return color;
  }
  return null;
}

window.toRGB = function(color) {
  if ((typeof color === 'object') &&
      (typeof color.r === 'number') &&
      (typeof color.g === 'number') &&
      (typeof color.b === 'number'))
    return color;
  var r = colorR(color)
  var g = colorG(color)
  var b = colorB(color)
  if ((r !== null) ||
      (g !== null) ||
      (b !== null))
      return { r: r, g: g, b: b }

  return null;
}

window.fromRGB = function(rgb) {
  if ((typeof rgb === 'object') &&
      (typeof rgb.r === 'number') &&
      (typeof rgb.g === 'number') &&
      (typeof rgb.b === 'number')) {
    var hex = [
      rgb.r.toString(16),
      rgb.g.toString(16),
      rgb.b.toString(16)
    ];
    for(var item=0;item<hex.length;item++) {
      if (hex[item].length === 1) hex[item] = '0' + hex[item];
    }
    return '#' + hex.join('');
  }
  return null;
}

window.toHSB = function(color) {
  var rgb = toRGB(color)
  if (rgb) {
    var hsb = { h: 0, s: 0, b: 0 };
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max !== 0 ? 255 * delta / max : 0;
    if (hsb.s !== 0) {
      if (rgb.r === max)
        hsb.h = (rgb.g - rgb.b) / delta;
      else if (rgb.g === max)
        hsb.h = 2 + (rgb.b - rgb.r) / delta;
      else
        hsb.h = 4 + (rgb.r - rgb.g) / delta;
    } else {
      hsb.h = -1;
    }
    hsb.h *= 60;
    if (hsb.h < 0)
      hsb.h += 360;
    hsb.s *= 100/255;
    hsb.b *= 100/255;
    return hsb;
  }

  return null;
}

window.fromHSB = function(hsb) {
  if ((typeof hsb === 'object') &&
      (typeof hsb.h === 'number') &&
      (typeof hsb.s === 'number') &&
      (typeof hsb.b === 'number')) {
    var rgb = {};
    var h = Math.round(hsb.h);
    var s = Math.round(hsb.s * 255 / 100);
    var v = Math.round(hsb.b * 255 / 100);
    if (s === 0) {
        rgb.r = rgb.g = rgb.b = v;
    } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;
        if(h === 360) h = 0;
        if(h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
        else if(h < 120) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
        else if(h < 180) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
        else if(h < 240) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
        else if(h < 300) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
        else if(h < 360) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
        else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
    }
    return {
        r: Math.round(rgb.r),
        g: Math.round(rgb.g),
        b: Math.round(rgb.b)
    };
  }

  return null;
}




function onKeyResponse() {
  var _this = this;
  var leftDown = _this.$t("macro.macro_left_down");
  var leftUp = _this.$t("macro.macro_left_up");
  var rightDown = _this.$t("macro.macro_right_down");
  var rightUp = _this.$t("macro.macro_right_up");
  window.onKeyDown(function(data) {
    var taskItem = {
      "taskName": "KeyDown",
      "taskValue": data[0]
    }
    switch (_this.mode) {
      case 'new':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'edit':{
        _this.macrodata.TaskList.push(taskItem);
        return false;
      }
      break;
      case 'before':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'after':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
    }
  });
  window.onKeyUp(function(data) {
    var taskItem = {
      "taskName": "KeyUp",
      "taskValue": data[0]
    }
    switch (_this.mode) {
      case 'new':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'edit':{
        _this.macrodata.TaskList.push(taskItem);
        return false;
      }
      break;
      case 'before':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'after':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
    }
  });
  window.onDelay(function(data) {
    data[0] = (parseInt(data[0]) < 5) ? '5' : data[0];
    var taskItem = {
      "taskName": "Delay",
      "taskValue": _this.macro_delay_time
    }
    switch (_this.mode) {
      case 'new':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'edit':{
        _this.macrodata.TaskList.push(taskItem);
        return false;
      }
      break;
      case 'before':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
      case 'after':{
        _this.macrodata.TaskList.push(taskItem);
      }
      break;
    }
  });
  window.onMouseDown(function(data) {
    var taskItem = {
      "taskName": "LeftDown",
      "taskValue": ""
    }
    if ( data[0] == 0 ) {
      taskItem.taskName = "LeftDown";
      switch (_this.mode) {
        case 'new':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'edit':{
          _this.macrodata.TaskList.push(taskItem);
          return false;
        }
        break;
        case 'before':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'after':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
      }
    } else {
      taskItem.taskName = "RightDown";
      switch (_this.mode) {
        case 'new':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'edit':{
          _this.macrodata.TaskList.push(taskItem);
          return false;
        }
        break;
        case 'before':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'after':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
      }
    }
  });
  window.onMouseUp(function(data) {
    var taskItem = {
      "taskName": "LeftUp",
      "taskValue": ""
    }
    if (data[0] == 0) {
      taskItem.taskName = "LeftUp";
      switch (_this.mode) {
        case 'new':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'edit':{
          _this.macrodata.TaskList.push(taskItem);
          return false;
        }
        break;
        case 'before':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'after':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
      }
    } else {
      taskItem.taskName = "RightUp";
      switch (_this.mode) {
        case 'new':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'edit':{
          _this.macrodata.TaskList.push(taskItem);
          return false;
        }
        break;
        case 'before':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
        case 'after':{
          _this.macrodata.TaskList.push(taskItem);
        }
        break;
      }
    }
  });
}