import { useErrorModal } from "@/components/error/ErrorContext";
import { useState, useEffect, useCallback } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import UserPreference, {
  defaultPreferenceOf,
  PreferenceEntry,
  PreferenceValue,
} from "./UserPreference";

type ChangeHandler = { [key: string]: [() => void] };

const CHANGE_LISTENER_HANDLERS: ChangeHandler = {
  [UserPreference.AUTO_RERUN_ON_SETTING_CHANGE]: [() => {}],
};

const addPreferenceChangeHandler = (
  userPreference: UserPreference,
  onChange: () => void
) => {
  const handlers = CHANGE_LISTENER_HANDLERS[userPreference];
  if (handlers) {
    handlers.push(onChange);
  } else {
    CHANGE_LISTENER_HANDLERS[userPreference] = [onChange];
  }
};

const onPreferenceChanged = (userPreference: UserPreference) => {
  const handlers = CHANGE_LISTENER_HANDLERS[userPreference];
  if (handlers) {
    handlers.forEach((it) => it());
  }
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

  const refreshEntryFromDb = useCallback(() => {
    getByID(userPreference).then(
      (setting: PreferenceEntry) => {
        if (setting) {
          setPreferenceEntry(setting);
        } else {
          add(defaultPreferenceOf(userPreference)).then(
            () => {},
            (error) => {
              showError(error);
            }
          );
        }
      },
      (error) => {
        showError(error);
      }
    );
  }, [add, getByID, showError, userPreference]);

  useEffect(() => {
    refreshEntryFromDb();
  }, []);

  addPreferenceChangeHandler(userPreference, refreshEntryFromDb);

  const updateEntry = (value: PreferenceValue) => {
    const updatedEntry: PreferenceEntry = {
      name: userPreference,
      value: value,
    };
    update(updatedEntry).then(
      () => {
        setPreferenceEntry(updatedEntry);
        onPreferenceChanged(userPreference);
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
