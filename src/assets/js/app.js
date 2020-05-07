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
