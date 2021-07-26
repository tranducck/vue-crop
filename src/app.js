const IMG_URL = 'https://fengyuanchen.github.io/cropperjs/images/picture.jpg';

function getImageRatio(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('aaa'));
    };
  });
}

export default {
  name: 'app',
  data() {
    return {
      ratio: 0,

      cropWidth: 400,
      cropHeight: 200,
      imgWidth: 400,
      imgHeight: 200,

      // mouse
      pConX: 0,
      pConY: 0,
      mouseX: 0,
      mouseY: 0,
      pConX0: 0,
      pConY0: 0,
      mouseType: 'drag', // drag, drag-left, drag-right, drag-top, drag-bottom
      mouseDown: false, // detect mouse is pressing

      startWidth: 0,
      startHeight: 0,

      error: false,
    };
  },

  async created() {
    const { width, height } = await getImageRatio(IMG_URL);
    this.imgWidth = width;
    this.imgHeight = height;

    this.cropWidth = this.imgWidth / 2;
    this.cropHeight = this.imgHeight / 2;
    this.pConX = (this.imgWidth - this.cropWidth) / 2;
    this.pConY = (this.imgHeight - this.cropHeight) / 2;

    window.document.addEventListener('mouseup', this.onMouseup);
    window.document.addEventListener('mousemove', this.onMouseOver);
  },

  destroyed() {
    window.document.removeEventListener('mouseup', this.onMouseup);
    window.document.removeEventListener('mousemove', this.onMouseOver);
  },

  methods: {
    onMouseup() {
      if (!this.mouseDown) return;
      this.mouseDown = false;
    },

    onMouseOver(e) {
      if (!this.mouseDown) return;
      if (this.mouseType === 'drag') {
        this.pConX = this.pConX0 + e.clientX - this.mouseX;
        this.pConY = this.pConY0 + e.clientY - this.mouseY;

        if (this.pConX < 0) this.pConX = 0;
        if (this.pConX + this.cropWidth > this.imgWidth) {
          this.pConX = this.imgWidth - this.cropWidth;
        }

        if (this.pConY < 0) this.pConY = 0;
        if (this.pConY + this.cropHeight > this.imgHeight) {
          this.pConY = this.imgHeight - this.cropHeight;
        }
      }

      if (this.mouseType === 'drag-left') {
        this.pConX = this.pConX0 + e.clientX - this.mouseX;
        if (this.pConX < 0) this.pConX = 0;
        this.cropWidth = this.startWidth + this.pConX0 - this.pConX;
        if (this.cropWidth <= 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.mouseType = 'drag-right';
          return;
        }
      }

      if (this.mouseType === 'drag-right') {
        this.cropWidth = this.startWidth + e.clientX - this.mouseX;
        if (this.cropWidth < 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.pConX0 = this.pConX;
          this.mouseType = 'drag-left';
          return;
        }
        if (this.cropWidth + this.pConX > this.imgWidth) {
          this.cropWidth = this.imgWidth - this.pConX;
        }
      }

      if (this.mouseType === 'drag-top') {
        this.pConY = this.pConY0 + e.clientY - this.mouseY;
        if (this.pConY < 0) this.pConY = 0;
        this.cropHeight = this.startHeight + this.pConY0 - this.pConY;
        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.mouseType = 'drag-bottom';
          return;
        }
      }

      if (this.mouseType === 'drag-bottom') {
        this.cropHeight = this.startHeight + e.clientY - this.mouseY;
        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.pConY0 = this.pConY;
          this.mouseType = 'drag-top';
          return;
        }
        if (this.cropHeight + this.pConY > this.imgHeight) {
          this.cropHeight = this.imgHeight - this.pConY;
        }
      }

      if (this.mouseType === 'drag-bottom-right') {
        this.cropHeight = this.startHeight + e.clientY - this.mouseY;
        this.cropWidth = this.startWidth + e.clientX - this.mouseX;
        if (this.cropHeight + this.pConY > this.imgHeight) {
          this.cropHeight = this.imgHeight - this.pConY;
        }
        if (this.cropWidth + this.pConX > this.imgWidth) {
          this.cropWidth = this.imgWidth - this.pConX;
        }

        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.pConY0 = this.pConY;
          this.mouseType = 'drag-top-right';
          return;
        }

        if (this.cropWidth < 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.pConX0 = this.pConX;
          this.mouseType = 'drag-bottom-left';
          return;
        }
      }

      if (this.mouseType === 'drag-bottom-left') {
        this.cropHeight = this.startHeight + e.clientY - this.mouseY;
        if (this.cropHeight + this.pConY > this.imgHeight) {
          this.cropHeight = this.imgHeight - this.pConY;
        }
        this.pConX = this.pConX0 + e.clientX - this.mouseX;
        if (this.pConX < 0) this.pConX = 0;
        this.cropWidth = this.startWidth + this.pConX0 - this.pConX;

        if (this.cropWidth <= 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.mouseType = 'drag-bottom-right';
          return;
        }

        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.pConY0 = this.pConY;
          this.mouseType = 'drag-top-left';
          return;
        }
      }

      if (this.mouseType === 'drag-top-right') {
        this.pConY = this.pConY0 + e.clientY - this.mouseY;
        if (this.pConY < 0) this.pConY = 0;
        this.cropHeight = this.startHeight + this.pConY0 - this.pConY;

        this.cropWidth = this.startWidth + e.clientX - this.mouseX;
        if (this.cropWidth + this.pConX > this.imgWidth) {
          this.cropWidth = this.imgWidth - this.pConX;
        }

        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.mouseType = 'drag-bottom-right';
        }

        if (this.cropWidth < 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.pConX0 = this.pConX;
          this.mouseType = 'drag-top-left';
          return;
        }
      }

      if (this.mouseType === 'drag-top-left') {
        this.pConY = this.pConY0 + e.clientY - this.mouseY;
        if (this.pConY < 0) this.pConY = 0;
        this.cropHeight = this.startHeight + this.pConY0 - this.pConY;

        this.pConX = this.pConX0 + e.clientX - this.mouseX;
        if (this.pConX < 0) this.pConX = 0;
        this.cropWidth = this.startWidth + this.pConX0 - this.pConX;

        if (this.cropHeight < 0) {
          this.cropHeight = 0;
          this.startHeight = 0;
          this.mouseY = e.clientY;
          this.mouseType = 'drag-bottom-left';
          return;
        }

        if (this.cropWidth <= 0) {
          this.cropWidth = 0;
          this.startWidth = 0;
          this.mouseX = e.clientX;
          this.mouseType = 'drag-top-right';
        }
      }
    },

    onMouseDown(e, type) {
      e.preventDefault();

      if (this.mouseDown) return false; // no dragdrop
      this.mouseType = type;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.pConX0 = this.pConX;
      this.pConY0 = this.pConY;
      this.startWidth = this.cropWidth;
      this.startHeight = this.cropHeight;
      this.mouseDown = true;
      return false; // no dragdrop
    },
  },

  render() {
    if (this.error) return <div>DANGER</div>;
    let imgStyle = `width: ${this.imgWidth}px; height: ${this.imgHeight}px;`;
    imgStyle += `transform: translate(${-this.pConX}px, ${-this.pConY}px)`;

    let cropStyle = `width: ${this.cropWidth}px; height: ${this.cropHeight}px;`;
    cropStyle += `transform: translate(${this.pConX}px, ${this.pConY}px)`;

    return (
      <div class="d-flex align-items-center justify-content-center" style="height: 100vh">
        <div class="crop-container" style={`width:${this.imgWidth}px;height:${this.imgHeight}px`}>
          <img src={IMG_URL} style={`width:${this.imgWidth}px;height:${this.imgHeight}px`} />
          <div class="crop-overlay" />
          <div class="crop-box" style={cropStyle}>
            <div class="crop-box-image-view">
              <img src={IMG_URL} class="crop-box-image" style={imgStyle} />
            </div>

            <div class="crop-box-drag" vOn:mousedown={(e) => this.onMouseDown(e, 'drag')} />
            <div
              class="crop-box-line line-top"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-top')}
            />
            <div
              class="crop-box-line line-bottom"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-bottom')}
            />
            <div
              class="crop-box-line line-left"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-left')}
            />
            <div
              class="crop-box-line line-right"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-right')}
            />
            <div
              class="crop-box-point point-top"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-top')}
            />
            <div
              class="crop-box-point point-left"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-left')}
            />
            <div
              class="crop-box-point point-right"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-right')}
            />
            <div
              class="crop-box-point point-bottom"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-bottom')}
            />
            <div
              class="crop-box-point point-top-left"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-top-left')}
            />
            <div
              class="crop-box-point point-top-right"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-top-right')}
            />
            <div
              class="crop-box-point point-bottom-left"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-bottom-left')}
            />
            <div
              class="crop-box-point point-bottom-right"
              vOn:mousedown={(e) => this.onMouseDown(e, 'drag-bottom-right')}
            />
          </div>
        </div>
      </div>
    );
  },
};
