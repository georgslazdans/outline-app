function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object";
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  if (!isObject(obj1) || !isObject(obj2)) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const deepMerge = (defaultObject: any, currentObject: any): any => {
  const result = { ...defaultObject }; // Start with the default object

  for (const key in currentObject) {
    if (currentObject.hasOwnProperty(key)) {
      if (
        typeof currentObject[key] === "object" &&
        currentObject[key] !== null &&
        !Array.isArray(currentObject[key])
      ) {
        result[key] = deepMerge(defaultObject[key], currentObject[key]);
      } else {
        result[key] = currentObject[key];
      }
    }
  }

  return result;
};

export default deepEqual;
