const clamp = (num, min, max) => num < min ? min : num > max ? max : num;

/**
 * Given a temperature (in Kelvin), estimate an RGB equivalent
 * 
 * @param {Number} temp Temperature in kelvin (K) in range [1000, 40000]
 * @returns {{ r:number, g:number, b:number }} RGB channel intensities in range [0, 255]
 * @description Ported from http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
 */
function kelvinToRGB(temp) {
    temp = clamp(temp, 1000, 40000) / 100;

    return {
        r: temp <= 66 ? 255 :
            clamp(329.698727446 * (Math.pow(temp - 60, -0.1332047592)), 0, 255),  // .988
        
        g: temp <= 66 ? 
            clamp(99.4708025861 * Math.log(temp) - 161.1195681661, 0, 255) :      // .996
            clamp(288.1221695283 * (Math.pow(temp - 60, -0.0755148492)), 0, 255), // .987

        b: temp >= 66 ? 255 :
            temp <= 19 ? 0 :
            clamp(138.5177312231 * Math.log(temp - 10) - 305.0447927307, 0, 255)  // .998
    }
}

/**
 * Applies a white balance adjustment to a pixel in RGB colorspace
 * 
 * @param {{r:number,g:number,b:number}} pixel 
 * @param {number} temp 
 * @returns New RGB values with white balance adjustment
 */
function whiteBalance(pixel, temp) {
    const color = kelvinToRGB(temp);
    pixel.r = pixel.r * (255 / color.r);
    pixel.g = pixel.g * (255 / color.g);
    pixel.b = pixel.b * (255 / color.b);

    return pixel;
}

function brightness(pixel, value) {
    const factor = 255 * (value / 100);
    pixel.r = pixel.r + factor;
    pixel.g = pixel.g + factor;
    pixel.b = pixel.b + factor;

    return pixel;
}

/**
 * Clips value to range `[0, 255]`
 * 
 * @param {Number} value 
 * @returns {Number} truncated value
 */
function truncate(value) {
    if (value < 0) return 0;
    else if (value > 255) return 255;
    else return value;
}

/**
 * Adjusts the contrast of a given pixel
 * 
 * @param {{r:number,g:number,b:number}} pixel 
 * @param {number} value Amount to change contrast in range [-100, 100] where `0 = no change`
 * @returns Pixel with contrast adjustment in RGB colorspace
 */
function contrast(pixel, value) {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    pixel.r = truncate(factor * (pixel.r - 128) + 128);
    pixel.g = truncate(factor * (pixel.g - 128) + 128);
    pixel.b = truncate(factor * (pixel.b - 128) + 128);

    return pixel;
}

/**
 * Saturates a given pixel in RGB color space
 * 
 * For the value field:
 * ```
 * 0.0 - black and white
 * 0.5 - reduces saturation by half
 * 1.0 - no change
 * 2.0 - double saturation
 * ```
 * 
 * @param {{r:number,g:number,b:number}} pixel 
 * @param {number} value Saturation amount in range `[0, 4.0]`
 * @returns Saturated pixel in RGB color space
 * @description Ported from Darel Rex Finley's C algorithm: https://alienryderflex.com/saturation.html
 */
function saturation(pixel, value) {
    const Pr = 0.299;
    const Pg = 0.587;
    const Pb = 0.114;

    const factor = Math.sqrt(
        pixel.r * pixel.r * Pr +
        pixel.g * pixel.g * Pg +
        pixel.b * pixel.b * Pb
    );

    pixel.r = truncate(factor + (pixel.r - factor) * value);
    pixel.g = truncate(factor + (pixel.g - factor) * value);
    pixel.b = truncate(factor + (pixel.b - factor) * value);

    return pixel;
}

function scale(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function highlights(pixel, value) {
    const Pr = 0.299;
    const Pg = 0.587;
    const Pb = 0.114;

    const Y = (Pr * pixel.r) + (Pg * pixel.g) + (Pb * pixel.b);

    if (Y >= 170) {
        pixel = brightness(pixel, value);
    }

    return pixel;
}

function shadows(pixel, value) {
    const Pr = 0.299;
    const Pg = 0.587;
    const Pb = 0.114;

    const Y = (Pr * pixel.r) + (Pg * pixel.g) + (Pb * pixel.b);
    const factor = scale(0, 85, 0, 1.0);

    if (Y <= 85) {
        pixel = brightness(pixel, value * factor);
    }

    return pixel;
}

export {
    whiteBalance,
    brightness,
    contrast,
    saturation,
    highlights,
    shadows
}