module.exports = (req, res, next) => {
  const oneKb = 1024;
  const minSize = oneKb*100;
  const maxSize = oneKb*oneKb*2;
  try {
    const file = req.files.file;
    const regExp = /\/(jpg|jpeg|gif|png)$/;

    if (!file.mimetype.match(regExp)) {
      return res.status(400).json({ message: "Avatar should be image type" });
    }
    if (file.size < minSize) {
      return res.status(400).json({ message: `Avatar size should be more than ${minSize/oneKb}Kb` });
    }
    if (file.size > maxSize) {
      return res.status(400).json({ message: `Avatar size should be less than ${maxSize/oneKb/oneKb}Mb` });
    }
    next();

  } catch (e) {
    return res.status(401).json({ message: 'Auth error'});
  }
};
