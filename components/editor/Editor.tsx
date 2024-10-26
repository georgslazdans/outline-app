"use client";

import {Dictionary} from "@/app/dictionaries";
import React from "react";

import {ModelCacheProvider} from "./cache/ModelCacheContext";
import {EditorProvider} from "./EditorContext";
import EditorComponent from "./EditorComponent";
import {ContourCacheProvider} from "./cache/ContourCacheContext";
import {EditorHistoryProvider} from "./history/EditorHistoryContext";
import {ModelDataProvider} from "./ModelDataContext";
import {ModelLoadingIndicatorProvider} from "./cache/ModelLoadingIndicatorContext";
import PointClickProvider from "./mode/contour/selection/PointClickContext";
import {ModelProvider} from "@/components/editor/ModelContext";

type Props = {
    dictionary: Dictionary;
};

const Editor = ({dictionary}: Props) => {
    return (
        <>
            <ModelProvider>
                <EditorProvider>
                    <ContourCacheProvider>
                        <ModelLoadingIndicatorProvider>
                            <ModelCacheProvider>
                                <EditorHistoryProvider>
                                    <ModelDataProvider>
                                        <PointClickProvider>
                                            <EditorComponent dictionary={dictionary}></EditorComponent>
                                        </PointClickProvider>
                                    </ModelDataProvider>
                                </EditorHistoryProvider>
                            </ModelCacheProvider>
                        </ModelLoadingIndicatorProvider>
                    </ContourCacheProvider>
                </EditorProvider>
            </ModelProvider>
        </>
    );
};

export default Editor;
