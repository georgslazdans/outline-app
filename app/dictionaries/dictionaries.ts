import 'server-only'
 
const dictionaries = {
    en: () => import('./en.json').then((module) => module.default),
    lv: () => import('./lv.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en'|'lv') => dictionaries[locale]()
