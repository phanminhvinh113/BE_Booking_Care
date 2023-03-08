const convertToImageBase64 = (data) => {
  data.forEach((item) => {
    //
    if (item.image) {
      item.image = Buffer.from(item.image, "base64").toString("binary") || " ";
    }
    //
    if (item.User?.image) {
      item.User.image = Buffer.from(item.User.image, "base64").toString(
        "binary"
      );
    }
  });
};

module.exports = {
  convertToImageBase64,
};
