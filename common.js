export const readThemeActivationTime = async (theme) => {
  const time = (await browser.storage.local.get(theme))[theme];
  return time
}

const calculateActivationUnixTime = (themeHours, themeMinutes) => {
  const now = new Date();
  const unixTimeNow = now.getTime();
  const activationUnixTimeToday = now.setHours(themeHours, themeMinutes);
  const activationUnixTimeTomorrow = now.setDate(now.getDate()+1);
  const activationUnixTime = activationUnixTimeToday > unixTimeNow + 5000 ? activationUnixTimeToday : activationUnixTimeTomorrow;
  return activationUnixTime
}

export const activateAlarm = (theme, themeActivationTime) => {
  const [themeHours, themeMinutes] = themeActivationTime.split(":");
  const activationUnixTime = calculateActivationUnixTime(themeHours, themeMinutes);
  browser.alarms.create(theme, { when: activationUnixTime });
  return activationUnixTime
}

export const changeTheme = (theme) => {
  browser.browserSettings.overrideContentColorScheme
    .set({ value: theme });
}

export const getThemeForCurrentTime = async (darkModeActivationUnixTime, lightModeActivationUnixTime) => {
  // If dark mode will activate later than light mode, then next theme will be light mode, which means current theme is dark mode
  const currentTimeTheme = darkModeActivationUnixTime > lightModeActivationUnixTime ? "dark" : "light";
  return currentTimeTheme
}