window.initEnvConfig = () => {
  return new Promise(function(resolve) {
    window.readEnvConfig(function(data) {
      resolve(data);
    });
  });
}
window.initAppConfig = () => {
  return new Promise(function(resolve) {
    window.readAppConfig(function(data) {
      resolve(data);
    });
  });
}
window.initDeviceList = () => {
  return new Promise(function(resolve) {
    window.readModelList(function(data) {
      resolve(data);
    });
  });
}
window.initLeList = () => {
  return new Promise(function(resolve) {
    window.readLEList(function (data) {
      resolve(data);
    });
  });
}
window.initMacroList = () => {
  return new Promise(function(resolve) {
    window.readMacroList(function (data) {
      resolve(data);
    });
  });
}

window.initDeviceConfig = (deviceid) => {
  return new Promise(function(resolve) {
    window.readModelConfig(deviceid, function(data){
      resolve(data);
    });
  });
}
window.initDeviceKeymap = (deviceid) => {
  return new Promise(function(resolve) {
    window.readModelKeymap(deviceid, function (data) {
      resolve(data);
    });
  });
}
window.initDeviceFWVersion = (deviceid) => {
  return new Promise(function(resolve) {
    window.firmwareUpdateQuery(deviceid, function (data) {
      resolve(data);
    });
  });
}
window.initDeviceProfileList = function (deviceid) {
  return new Promise(function(resolve) {
    window.getProfileList(deviceid, function (data) {
      resolve(data);
    });
  });
}
window.initUserConfig = () => {
  return new Promise(function(resolve) {
    window.readUserConfig(data => {
      resolve(data);
    })
  });
}
