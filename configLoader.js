const fs = require('fs');
let configPath = 'config.json';
let rawdata = fs.readFileSync(configPath);
var config = JSON.parse(rawdata);
var zoombaPath = config.zoombaPath;
var zoombaPathInput = document.getElementById("zoombaPathInput");
zoombaPathInput.value = zoombaPath
updateConfig();

function updateConfig() {
  setDarkMode();
  setTestingMode();
  config.zoombaPath = zoombaPathInput.value;
  fs.writeFileSync(configPath, JSON.stringify(config))
}

function setDarkMode() {
  if (config.darkMode) {
    $('body').addClass('dark')
  } else {
    $('body').removeClass('dark')
  }
}

function setTestingMode() {
  if (config.testingMode) {
    $('#testingIndicator').show()
  } else {
    $('#testingIndicator').hide()
  }
}

function refreshPage() {
  location.reload(true / false);
}