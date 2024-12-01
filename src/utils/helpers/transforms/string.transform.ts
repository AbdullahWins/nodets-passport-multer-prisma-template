// src/utils/helpers/transforms/string.transform.ts
import { IKeyValueObject } from "../../../interfaces";

export const generateKeyString = (selectableFields: IKeyValueObject) => {
  const keys = Object.keys(selectableFields); // Extract keys from the queries object
  const keysString = keys.join(" "); // Generate string with keys separated by spaces

  return keysString;
};
