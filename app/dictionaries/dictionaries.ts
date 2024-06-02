import 'server-only'
 
const dictionaries = {
    en: () => import('./en.json').then((module) => module.default),
    lv: () => import('./lv.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en'|'lv') => dictionaries[locale]()

// TODO this might need a special place
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;