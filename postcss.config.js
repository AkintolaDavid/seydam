export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }, css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "cropperjs/dist/cropper.css";`
      }
    }
  }
}
