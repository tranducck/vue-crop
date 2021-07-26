export default {
  name: 'image-crop',
  props: ['img'],
  data() {
    return {
      ratio: 0,

      cropWidth: 400,
      cropHeight: 200,

      // mouse
      pConX: 0,
      pConY: 0,
      pConX0: 0,
      pConY0: 0,
      mouseType: 'drag', // horizontal, vertical, all, drag

      error: false
    };
  },


}
