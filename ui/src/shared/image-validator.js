let validPrecursor = "https://books.google.co";
let allowedTypes = ["jpg", "jpeg", "png"];

export const validImage = (image) => {
  if (image.startsWith(validPrecursor)) {
    return true;
  }

  for (var i = 0; i < allowedTypes.length; i++) {
    var format = allowedTypes[i];
    if (image.endsWith(format)) {
      return true;
    }
  }
  return false;
};
