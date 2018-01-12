// let template = html`Hello ${"foo"}!`;
// template({ foo: "World" }); // "Hello World!"
window.html = function(strings, ...keys) {
  return function(...values) {
    if (!values) {
      return '';
    }
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
};
