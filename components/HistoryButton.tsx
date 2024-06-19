"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

type Props = {
  dictionary: Dictionary;
};

const HistoryButton = ({ dictionary }: Props) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/history")}>
      <label>{dictionary.history.title}</label>
    </Button>
  );
};

export default HistoryButton;
