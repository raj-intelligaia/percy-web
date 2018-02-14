import {Factory, trait} from 'ember-cli-mirage';

export const TEST_IMAGE_DIMS = {
  DEFAULT_HEIGHT: 1485,
  DEFAULT_WIDTH: 1280,
  LOSSY_HEIGHT: 1044,
  LOSSY_WIDTH: 900,
  MOBILE_HEIGHT: 1598,
  MOBILE_WIDTH: 320,
};

export const TEST_IMAGE_URLS = {
  V2: '/images/test/v2.png',
  V1: '/images/test/v1.png',
  DIFF_URL: '/images/test/diff.png',
  V2_LOSSY: '/images/test/v2-lossy.jpg',
  V1_LOSSY: '/images/test/v1-lossy.jpg',
  V2_MOBILE: '/images/test/v2-mobile.png',
  V1_MOBILE: '/images/test/v1-mobile.png',
  DIFF_MOBILE: '/images/test/diff-mobile.png',
  V2_LOSSY_MOBILE: '/images/test/v2-lossy-mobile.jpg',
  V1_LOSSY_MOBILE: '/images/test/v1-lossy-mobile.jpg',
};

export default Factory.extend({
  afterCreate(screenshot, server) {
    if (screenshot.image === null) {
      let image = server.create('image');
      screenshot.update({image});
    }
    if (screenshot.lossyImage === null) {
      let lossyImage = server.create('image', {
        height: TEST_IMAGE_DIMS.LOSSY_HEIGHTS,
        width: TEST_IMAGE_DIMS.LOSSY_WIDTH,
        url: TEST_IMAGE_URLS.V2_LOSSY,
      });
      screenshot.update({lossyImage});
    }
  },

  v1: trait({
    afterCreate(screenshot, server) {
      const image = server.create('image', {
        url: TEST_IMAGE_URLS.V1,
      });
      const lossyImage = server.create('image', {
        height: TEST_IMAGE_DIMS.LOSSY_HEIGHTS,
        width: TEST_IMAGE_DIMS.LOSSY_WIDTH,
        url: TEST_IMAGE_URLS.V1_LOSSY,
      });

      screenshot.update({image, lossyImage});
    },
  }),

  mobile: trait({
    afterCreate(screenshot, server) {
      if (!screenshot.image) {
        screenshot.update({image: server.create('image')});
      }

      if (!screenshot.lossyImage) {
        screenshot.update({
          lossyImage: server.create('image', {
            height: TEST_IMAGE_DIMS.LOSSY_HEIGHTS,
            width: TEST_IMAGE_DIMS.LOSSY_WIDTH,
            url: TEST_IMAGE_URLS.V2_LOSSY,
          }),
        });
      }

      screenshot.image.update({width: TEST_IMAGE_DIMS.MOBILE_WIDTH});
      screenshot.lossyImage.update({width: TEST_IMAGE_DIMS.MOBILE_WIDTH});
    },
  }),
});
