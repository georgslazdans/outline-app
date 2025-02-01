
enum UserPreference {
  AUTO_RERUN_ON_SETTING_CHANGE = "auto-rerun-on-setting-change",
  AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME = "auto-rerun-on-setting-change-debounce_time",
}

const DEFAULT_VALUES = {
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE]: false,
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME]: 1000,
};

export type PreferenceValue = boolean | string | number;

export type PreferenceEntry = {
  name: string;
  value: PreferenceValue;
};

export const defaultPreferenceOf = (
  preference: UserPreference
): PreferenceEntry => {
  return {
    name: preference,
    value: DEFAULT_VALUES[preference],
  };
};

export default UserPreference;
