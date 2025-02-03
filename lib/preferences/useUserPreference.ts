import { useErrorModal } from "@/components/error/ErrorContext";
import { useState, useEffect, useCallback } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import UserPreference, {
  defaultPreferenceOf,
  PreferenceEntry,
  PreferenceValue,
} from "./UserPreference";

type ChangeHandler = { [key: string]: [(value: PreferenceValue) => void] };

const CHANGE_LISTENER_HANDLERS: ChangeHandler = {
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE]: [
    (value: PreferenceValue) => {},
  ],
};

const addPreferenceChangeHandler = (
  userPreference: UserPreference,
  onChange: (value: PreferenceValue) => void
) => {
  const handlers = CHANGE_LISTENER_HANDLERS[userPreference];
  if (handlers) {
    handlers.push(onChange);
  } else {
    CHANGE_LISTENER_HANDLERS[userPreference] = [onChange];
  }
};

const onPreferenceChanged = (
  userPreference: UserPreference,
  value: PreferenceValue
) => {
  const handlers = CHANGE_LISTENER_HANDLERS[userPreference];
  if (handlers) {
    handlers.forEach((it) => it(value));
  }
};

const INITIALIZATION_IN_FLIGHT: Record<
  string,
  Promise<PreferenceEntry> | null
> = {};

const initializeFromDb = (
  userPreference: UserPreference,
  getByID: (id: number | string) => Promise<PreferenceEntry>,
  add: (value: PreferenceEntry, key?: any) => Promise<number | string>
): Promise<PreferenceEntry> => {
  return new Promise((resolve, reject) => {
    getByID(userPreference).then(
      (setting: PreferenceEntry) => {
        if (setting) {
          resolve(setting);
        } else {
          const preference = defaultPreferenceOf(userPreference);
          add(preference).then(
            () => {
              resolve(preference);
            },
            (error) => {
              reject(error);
            }
          );
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const useUserPreference = (
  userPreference: UserPreference
): {
  value: PreferenceValue;
  updateEntry: (value: PreferenceValue) => void;
} => {
  const { showError } = useErrorModal();

  const { getByID, add, update } = useIndexedDB("preferences");
  const [preferenceEntry, setPreferenceEntry] = useState<PreferenceEntry>(
    defaultPreferenceOf(userPreference)
  );

  useEffect(() => {
    let promise = INITIALIZATION_IN_FLIGHT[userPreference];
    if (promise == null) {
      promise = initializeFromDb(userPreference, getByID, add);
      INITIALIZATION_IN_FLIGHT[userPreference] = promise;
    }
    promise.then((entry) => setPreferenceEntry(entry));
  }, [add, getByID, userPreference]);

  addPreferenceChangeHandler(userPreference, (value) => {
    setPreferenceEntry((previous) => {
      return { ...previous, value: value };
    });
  });

  const updateEntry = (value: PreferenceValue) => {
    const updatedEntry: PreferenceEntry = {
      name: userPreference,
      value: value,
    };
    update(updatedEntry).then(
      () => {
        setPreferenceEntry(updatedEntry);
        onPreferenceChanged(userPreference, updatedEntry.value);
      },
      (error) => {
        showError(error);
      }
    );
  };

  return {
    value: preferenceEntry.value,
    updateEntry: updateEntry,
  };
};
