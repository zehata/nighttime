import { readThemeActivationTime, activateAlarm, changeTheme, getThemeForCurrentTime } from "./common.js"

const readIfEnabled = async (theme) => {
  return (await browser.storage.local.get("enabled"))["enabled"] === "true";
}

const onload = async () => {
  if (!(await readIfEnabled())) return

  // Refresh alarms to account for DST
  browser.alarms.clear("dark");
  const darkThemeActivationTime = await readThemeActivationTime("dark");
  const darkModeActivationUnixTime = activateAlarm("dark", darkThemeActivationTime);

  browser.alarms.clear("light");
  const lightThemeActivationTime = await readThemeActivationTime("light");
  const lightModeActivationUnixTime = activateAlarm("light", lightThemeActivationTime);

  changeTheme(await getThemeForCurrentTime(darkModeActivationUnixTime, lightModeActivationUnixTime));
}
onload();

// onload will run when browser starts or when alarm triggers
browser.runtime.onStartup.addListener(() => {});
browser.alarms.onAlarm.addListener(() => {});