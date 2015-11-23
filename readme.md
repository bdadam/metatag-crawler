# metadata-crawler

This is a simple node.js module for scraping meta information from web pages.

## Install

```
npm install --save metatag-crawler
```

## Usage
```JavaScript
var scrape = require('metatag-crawler');
scrape('https://www.youtube.com/watch?v=jNQXAC9IVRw', function(err, data) {
  console.log(err); // null
  console.log(data.title); // Me at the zoo
  console.log(data.description); // The first video on YouTube. Maybe it's time to go back to the zoo?
  console.log(data.canonical); // https://www.youtube.com/watch?v=jNQXAC9IVRw

  console.log(data);
  /*
  {
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw&hl=en',
    title: 'Me at the zoo',
    description: 'The first video on YouTube. Maybe it\'s time to go back to the zoo?',
    canonical: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    images: [{
      url: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg'
    }],
    videos: [{
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      type: 'text/html',
      width: 480,
      height: 360
    }, {
      url: 'https://www.youtube.com/v/jNQXAC9IVRw?version=3&autohide=1',
      type: 'application/x-shockwave-flash',
      width: 480,
      height: 360
    }]
  }
  */
});
```
