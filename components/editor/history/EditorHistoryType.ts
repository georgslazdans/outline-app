"use client";

enum EditorHistoryType {
  INITIAL,
  TRANSLATION,
  ROTATION,
  OBJ_ADDED,
  OBJ_DELETED,
  OBJ_UPDATED,
  OBJ_REORDER,
  GROUP_ADDED,
  CONTOUR_UPDATED,
}

export default EditorHistoryType;
