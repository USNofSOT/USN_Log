const html2pdf = {
  from: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  save: jest.fn().mockResolvedValue(undefined),
};

module.exports = html2pdf;
