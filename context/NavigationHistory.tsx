import { useEffect, useState } from "react";

const useNavigationHistory = () => {
  const addHistory = (route: string) => {
    const history = JSON.parse(
      sessionStorage.getItem("navigationHistory") || "[]"
    );
    history.push(route);
    sessionStorage.setItem("navigationHistory", JSON.stringify(history));
  };

  const getHistory = () => {
    return JSON.parse(sessionStorage.getItem("navigationHistory") || "[]");
  };

  const clearHistory = () => {
    sessionStorage.removeItem("navigationHistory");
  };

  return { addHistory, getHistory, clearHistory };
};

export default useNavigationHistory;
