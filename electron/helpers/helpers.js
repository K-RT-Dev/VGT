function inDevMode() {
  if (
    process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV === 'development'
  ) {
    return true;
  }
  return false;
}

module.exports = {
  inDevMode,
};
