export default size => {
  const oneKb = 1024;
  const precision = 2;
  if (size > oneKb*oneKb*oneKb*oneKb) {
    return `${(size/(oneKb*oneKb*oneKb*oneKb)).toFixed(precision)}Tb`;
  }
  if (size > oneKb*oneKb*oneKb) {
    return `${(size/(oneKb*oneKb*oneKb)).toFixed(precision)}Gb`;
  }
  if (size > oneKb*oneKb) {
    return `${(size/(oneKb*oneKb)).toFixed(precision)}Mb`;
  }
  if (size > oneKb) {
    return `${(size/(oneKb)).toFixed(precision)}Kb`;
  }
  return `${size}B`;
};
