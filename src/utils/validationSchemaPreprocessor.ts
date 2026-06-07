export const requiredPreprocessor = (val: unknown) => {
  if (
    val === undefined ||
    val === null ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return undefined;
  }
  return typeof val === "string" ? val.trim() : val;
};

export const optionalPreprocessor = (val: unknown) => {
  if (
    val === undefined ||
    val === null ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return null;
  }
  return typeof val === "string" ? val.trim() : val;
};

export const patchPreprocessor = (val: unknown) => {
  if (val === undefined) {
    return undefined;
  }
  if (val === null || (typeof val === "string" && val.trim() === "")) {
    return null;
  }
  return typeof val === "string" ? val.trim() : val;
};

export const emailPreprocessor = (val: unknown) => {
  const processed = requiredPreprocessor(val);
  return typeof processed === "string" ? processed.toLowerCase() : processed;
};

export const textPreprocessor = (val: unknown) => requiredPreprocessor(val);
