export let colorR = function(color) {
    var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    var regColor16 = /^0x([0-9a-fA-F]{6})$/;
    color = color.toLowerCase();
    if (regColorJS.test(color)) {
      if (color.length === 4) {
        var colorNew = "#";
        for (var i=1; i<4; i+=1) {
          colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
        }
        color = colorNew;
      }
  
      return parseInt("0x" + color.slice(1, 3));
    } else if (regColor16.test(color)) {
      return parseInt("0x" + color.slice(2, 4));
    }
    return null;
  }
  
  export let colorG = function(color) {
    var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    var regColor16 = /^0x([0-9a-fA-F]{6})$/;
    color = color.toLowerCase();
    if (regColorJS.test(color)) {
      if (color.length === 4) {
        var colorNew = "#";
        for (var i=1; i<4; i+=1) {
          colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
        }
        color = colorNew;
      }
  
      return parseInt("0x" + color.slice(3, 5));
    } else if (regColor16.test(color)) {
      return parseInt("0x" + color.slice(4, 6));
    }
    return null;
  }
  
  export let colorB = function(color) {
    var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    var regColor16 = /^0x([0-9a-fA-F]{6})$/;
    color = color.toLowerCase();
    if (regColorJS.test(color)) {
      if (color.length === 4) {
        var colorNew = "#";
        for (var i=1; i<4; i+=1) {
          colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
        }
        color = colorNew;
      }
  
      return parseInt("0x" + color.slice(5, 7));
    } else if (regColor16.test(color)) {
      return parseInt("0x" + color.slice(6, 8));
    }
    return null;
  }
  
  export let toJS = function(color) {
    var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    var regColor16 = /^0x([0-9a-fA-F]{6})$/;
    color = color.toLowerCase();
    if (regColorJS.test(color))
      return color;
    if (regColor16.test(color)) {
      var colorNew = "#";
      colorNew += color.slice(2, 8);
      color = colorNew;
      return color;
    }
    return null;
  }
  
  export let to16 = function(color) {
    var regColorJS = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    var regColor16 = /^0x([0-9a-fA-F]{6})$/;
    color = color.toLowerCase();
    if (regColor16.test(color))
      return color;
    if (regColorJS.test(color)) {
      if (color.length === 4) {
        var colorNew = "#";
        for (var i=1; i<4; i+=1) {
          colorNew += color.slice(i, i+1).concat(color.slice(i, i+1));
        }
        color = colorNew;
      }
      // var colorNew = "0x";
      colorNew += color.slice(1, 7);
      color = colorNew;
      return color;
    }
    return null;
  }
  
  export let toRGB = function(color) {
    if ((typeof color === 'object') &&
        (typeof color.r === 'number') &&
        (typeof color.g === 'number') &&
        (typeof color.b === 'number'))
      return color;
    var r = colorR(color)
    var g = colorG(color)
    var b = colorB(color)
    if ((r !== null) ||
        (g !== null) ||
        (b !== null))
        return { r: r, g: g, b: b }
  
    return null;
  }
  
  export let fromRGB = function(rgb) {
    if ((typeof rgb === 'object') &&
        (typeof rgb.r === 'number') &&
        (typeof rgb.g === 'number') &&
        (typeof rgb.b === 'number')) {
      var hex = [
        rgb.r.toString(16),
        rgb.g.toString(16),
        rgb.b.toString(16)
      ];
      for(var item=0;item<hex.length;item++) {
        if (hex[item].length === 1) hex[item] = '0' + hex[item];
      }
      return '#' + hex.join('');
    }
    return null;
  }
  
  export let toHSB = function(color) {
    var rgb = toRGB(color)
    if (rgb) {
      var hsb = { h: 0, s: 0, b: 0 };
      var min = Math.min(rgb.r, rgb.g, rgb.b);
      var max = Math.max(rgb.r, rgb.g, rgb.b);
      var delta = max - min;
      hsb.b = max;
      hsb.s = max !== 0 ? 255 * delta / max : 0;
      if (hsb.s !== 0) {
        if (rgb.r === max)
          hsb.h = (rgb.g - rgb.b) / delta;
        else if (rgb.g === max)
          hsb.h = 2 + (rgb.b - rgb.r) / delta;
        else
          hsb.h = 4 + (rgb.r - rgb.g) / delta;
      } else {
        hsb.h = -1;
      }
      hsb.h *= 60;
      if (hsb.h < 0)
        hsb.h += 360;
      hsb.s *= 100/255;
      hsb.b *= 100/255;
      return hsb;
    }
  
    return null;
  }
  
  export let fromHSB = function(hsb) {
    if ((typeof hsb === 'object') &&
        (typeof hsb.h === 'number') &&
        (typeof hsb.s === 'number') &&
        (typeof hsb.b === 'number')) {
      var rgb = {};
      var h = Math.round(hsb.h);
      var s = Math.round(hsb.s * 255 / 100);
      var v = Math.round(hsb.b * 255 / 100);
      if (s === 0) {
          rgb.r = rgb.g = rgb.b = v;
      } else {
          var t1 = v;
          var t2 = (255 - s) * v / 255;
          var t3 = (t1 - t2) * (h % 60) / 60;
          if(h === 360) h = 0;
          if(h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
          else if(h < 120) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
          else if(h < 180) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
          else if(h < 240) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
          else if(h < 300) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
          else if(h < 360) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
          else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
      }
      return {
          r: Math.round(rgb.r),
          g: Math.round(rgb.g),
          b: Math.round(rgb.b)
      };
    }
  
    return null;
  }
  