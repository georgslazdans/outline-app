"use client";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
    useRef,
} from "react";
import Model from "@/lib/Model";
import {defaultGridfinityParams} from "@/lib/replicad/model/item/gridfinity/GridfinityParams";
import {gridfinityItemOf} from "@/lib/replicad/model/item/gridfinity/Gridfinity";
import {useIndexedDB} from "react-indexed-db-hook";
import {useErrorModal} from "@/components/error/ErrorContext";
import {useSearchParams} from "next/navigation";

type ModelContextType = {
    model: Model;
    setModel: React.Dispatch<React.SetStateAction<Model>>;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({children}: { children: ReactNode }) => {
    const {getByID, update} = useIndexedDB("models");
    const {showError} = useErrorModal();

    const defaultModel = {
        name: "Untitled",
        modelData: {items: [gridfinityItemOf(defaultGridfinityParams())]},
        addDate: new Date(),
    };
    const [model, setModelContext] = useState<Model>(defaultModel);
    const modelRef = useRef<Model>(model);

    const searchParams = useSearchParams();

    useEffect(() => {
        const urlId = searchParams.get("id")
        if (urlId) {
            const id = Number.parseInt(urlId);
            if (model.id != id) {
                getByID(id).then(
                    dbModel => {
                        if (dbModel) {
                            setModelContext(dbModel)
                        }
                    }
                )
            }
        }
    }, [getByID, model, searchParams]);

    const doAutosave = useCallback(() => {
        if (modelRef.current.id) {
            update(modelRef.current).then(
                () => {
                    console.log("Model saved!", modelRef.current.id);
                },
                (error) => {
                    showError(error);
                }
            );
        }
    }, [showError, update]);

    const createAutosaveTimeout = useCallback(() => {
        setTimeout(() => {
            doAutosave();
            createAutosaveTimeout();
        }, 1000 * 30);
    }, [doAutosave]);

    useEffect(() => {
        createAutosaveTimeout();
    }, [createAutosaveTimeout]);

    const setModel = (newModel: Model | ((model: Model) => Model)) => {
        let data: Model;
        if (typeof newModel === "function") {
            data = newModel(model);
        } else {
            data = newModel;
        }
        setModelContext(data);
        modelRef.current = data;
    };

    return (
        <ModelContext.Provider
            value={{
                model,
                setModel,
            }}
        >
            {children}
        </ModelContext.Provider>
    );
};

export const useModelContext = (): ModelContextType => {
    const context = useContext(ModelContext);
    if (context === undefined) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
};
