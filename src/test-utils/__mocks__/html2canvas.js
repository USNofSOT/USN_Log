const html2canvas = jest.fn().mockResolvedValue({
  toDataURL: jest.fn().mockReturnValue("data:image/png;base64,mock"),
});

module.exports = html2canvas;
