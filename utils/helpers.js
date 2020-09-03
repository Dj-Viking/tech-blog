const format_date = date => {
  return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
};

//format plural for the word comments
const format_plural = (word, count) => {
  if (amount >= 2 || amount === 0) {
    return `${word}s`
  } else if (amount === 1) {
    return word;
  }
};

//shorten the url next to the post title
const format_url = url => {
  return url
  .replace('http://', '')
  .replace('https://', '')
  .replace('www.', '')
  .split('/')[0]
  .split('?')[0];
};

module.exports = {
  format_date,
  format_plural,
  format_url
};