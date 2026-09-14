export function success(data = null, message = null) {
  return {
    success: true,
    data,
    message,
  };
}

export function error(message = null, data = null) {
  return {
    success: false,
    data,
    message,
  };
}
