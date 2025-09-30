export const fontSizeConfig = {
  title: {
    default: 48,
    min: 24,
    max: 72,
    unit: 'px'
  },
  body: {
    default: 16,
    min: 12,
    max: 24,
    unit: 'px'
  },
  signature: {
    default: 48,
    min: 24,
    max: 72,
    unit: 'px'
  },
  headers: {
    default: 24,
    min: 18,
    max: 36,
    unit: 'px'
  },
  lists: {
    default: 18,
    min: 14,
    max: 28,
    unit: 'px'
  }
};

export const defaultFontSizes = {
  title: fontSizeConfig.title.default,
  body: fontSizeConfig.body.default,
  signature: fontSizeConfig.signature.default,
  headers: fontSizeConfig.headers.default,
  lists: fontSizeConfig.lists.default,
};