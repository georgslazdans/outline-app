import Options from "@/lib/utils/Options";

enum EditActionMenu {
  ITEMS = "items",
  ACTIONS = "actions",
  PROPERTIES = "properties",
}

const dictionaryPath = "editActionMenu";

export const editActionMenuOptionsFor = (dictionary: any) => Options.of(EditActionMenu).withTranslation(dictionary, dictionaryPath);

export default EditActionMenu