"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useState } from "react";
import Modal from "@/components/Modal";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/IconButton";
import { Tooltip } from "react-tooltip";
import UserPreferencesList from "./UserPreferencesList";
import AdditionalSettings from "./AdditionalSettings";
import Settings from "@/lib/opencv/Settings";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChanged: (settings: Settings) => void;
};

const OPEN_PREFERENCES_BUTTON = "open-user-preferences-modal";

const PreferencesModal = ({
  dictionary,
  settings,
  onSettingsChanged,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onModalClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <IconButton
        id={OPEN_PREFERENCES_BUTTON}
        className="w-12 h-12"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Cog6ToothIcon></Cog6ToothIcon>
      </IconButton>

      <Tooltip anchorSelect={"#" + OPEN_PREFERENCES_BUTTON} place="top">
        User Preferences and Additional Settings
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onModalClose}>
        <div className="mb-8">
          <UserPreferencesList></UserPreferencesList>
        </div>
        <div>
          <AdditionalSettings
            dictionary={dictionary}
            settings={settings}
            onSettingsChanged={onSettingsChanged}
          ></AdditionalSettings>
        </div>
      </Modal>
    </>
  );
};

export default PreferencesModal;
