import { readThemeActivationTime, activateAlarm, changeTheme, getThemeForCurrentTime } from "./common.js";

const defaultTime = {
  "dark": "18:00",
  "light": "06:00",
}

const themeNames = {
  "dark": "Dark mode",
  "light": "Light mode",
}

const writeThemeActivationTime = (theme, time) => {
  browser.storage.local.set({ [theme]: time });
}

const writeIfEnabled = (enabled) => {
  browser.storage.local.set({ "enabled": enabled });
}

const populateField = async (theme) => {
  const themeActivationTime = (await readThemeActivationTime(theme)) ?? defaultTime[theme];
  document.getElementById(theme).value = themeActivationTime;
}

const getAlarmEnabled = async (theme) => {
  const alarm = await browser.alarms.get(theme);

  return !!alarm
}

const getAlarmsEnabled = async () => {
  const alarms = await browser.alarms.getAll();

  return !!alarms.length
}

const populateEnabled = async () => {
  const alarmsEnabled = await getAlarmsEnabled();
  document.getElementById("enabled").checked = alarmsEnabled ? true : false;
}

const populatePopup = async () => {
  populateField("dark");
  populateField("light");
  populateEnabled();
}

const handleConfigChanges = async () => {
  const shouldEnable = document.getElementById("enabled").checked;
  const darkThemeActivationTime = document.getElementById("dark").value;
  const lightThemeActivationTime = document.getElementById("light").value;
  if (document.getElementById("enabled").checked && darkThemeActivationTime && lightThemeActivationTime) {
    writeThemeActivationTime("dark", darkThemeActivationTime);
    const darkModeActivationUnixTime = activateAlarm("dark", darkThemeActivationTime);

    writeThemeActivationTime("light", lightThemeActivationTime);
    const lightModeActivationUnixTime = activateAlarm("light", lightThemeActivationTime);

    changeTheme(await getThemeForCurrentTime(darkModeActivationUnixTime, lightModeActivationUnixTime));
    populateEnabled();
    writeIfEnabled("true");
    return
  }

  writeIfEnabled("false");
  browser.alarms.clearAll();
  populateEnabled();
}

const connectEnableCheckbox = () => {
  document.getElementById("enabled").addEventListener("click", handleConfigChanges)
}

const connectUpdateTime = (theme) => {
  document.getElementById(theme).addEventListener("change", handleConfigChanges)
}

const main = () => {
  populatePopup();
  connectEnableCheckbox();
  connectUpdateTime("dark");
  connectUpdateTime("light");
}
main();