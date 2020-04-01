/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
