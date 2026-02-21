export const getErrorMessage = (error) => {
  if (!error.response) {
    return error.message;
  }

  switch (error.response.status) {
    case 400:
      return error.response.data;
    case 405:
      return "Method Not Allowed. Please confirm you have set the correct API URL in the configuration file.";
    case 500:
      return error.response.statusText;
    case 502:
      return "Request failed due to Bad Gateway";
    case 504:
      return "Request failed due to Gateway Time-out";
    default:
      return "An unexpected error occurred. Please refresh the page and try again.";
  }
};

export const validAnonymousPath = (pathname) => {
  return (
    pathname === "/" ||
    pathname === "/forgot-password" ||
    pathname.includes("shelf") ||
    pathname.includes("review") ||
    pathname.includes("reset-password")
  );
};
