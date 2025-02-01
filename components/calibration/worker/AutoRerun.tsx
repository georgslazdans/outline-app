import { useLoading } from "@/context/LoadingContext";
import UserPreference from "@/lib/preferences/UserPreference";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import useDebounced from "@/lib/utils/Debounced";
import { useEffect } from "react";

const useAutoRerun = (settingsChanged: boolean, rerunOpenCv: () => void) => {
  const { loading } = useLoading();
  const { value: autoRerun } = useUserPreference(
    UserPreference.AUTO_RERUN_ON_SETTING_CHANGE
  );
  const { value: autoRerunDebounceTime } = useUserPreference(
    UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME
  );

  const { onChange: debouncedRerunOpenCv, cancel: cancelAutoRun } =
    useDebounced(() => {
      rerunOpenCv();
    }, autoRerunDebounceTime as number);

  useEffect(() => {
    if (settingsChanged && autoRerun && !loading) {
      debouncedRerunOpenCv(null);
    } else {
      cancelAutoRun();
    }
  }, [
    autoRerun,
    cancelAutoRun,
    debouncedRerunOpenCv,
    loading,
    settingsChanged,
  ]);
};

export default useAutoRerun;
