// let template = html`Hello ${"foo"}!`;
// template({ foo: "World" }); // "Hello World!"
window.html = function(strings, ...keys) {
  return function(...values) {
    if (!values) {
      return '';
    }
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
};
