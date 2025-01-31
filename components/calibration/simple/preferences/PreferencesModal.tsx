"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useState } from "react";
import Modal from "@/components/Modal";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/IconButton";
import { Tooltip } from "react-tooltip";
import UserPreferencesList from "./UserPreferencesList";

type Props = {
  dictionary: Dictionary;
};

const OPEN_PREFERENCES_BUTTON = "open-user-preferences-modal";

const PreferencesModal = ({ dictionary }: Props) => {
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
        User Preferences
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onModalClose}>
        <div>
          <UserPreferencesList></UserPreferencesList>
        </div>
      </Modal>
    </>
  );
};

export default PreferencesModal;
