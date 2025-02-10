enum UserPreference {
  AUTO_RERUN_ON_SETTING_CHANGE = "auto-rerun-on-setting-change",
  AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME = "auto-rerun-on-setting-change-debounce_time",
  AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT = "auto-scale-along-normals-on-contour-import",
  AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT_VALUE = "auto-scale-along-normals-on-contour-import-value",
}

const DEFAULT_VALUES = {
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE]: true,
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME]: 200,
  [UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT]: false,
  [UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT_VALUE]: 0.5,
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
