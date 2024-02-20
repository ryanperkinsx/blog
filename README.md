# ryanperkinsx.github.io

---

## credit where credit is due
- *GitHub pages portfolio idea from* [***David Zhao***](https://davidzhao98.github.io/)*, solid presentation format*
- [***favicon generator***](https://realfavicongenerator.net/)
- [***Pixel Art***](https://www.pixilart.com/draw) *for them pixels*
  - [***Son of Atom***](https://www.deviantart.com/sonofatom101) *for that Zoni inspiration*
    - [***Ratchet & Clank***](https://en.wikipedia.org/wiki/Ratchet_%26_Clank) *for being the best of games*
- *very helpful* [***JS docs***](https://javascript.info/custom-elements)
- *shoutout to Mozilla for helping with the drop-zone*:
  - [***link #1***](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)
  - [***link #2***](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event)
- [***sql.js***](https://sql.js.org/documentation/) is a wonderful Javascript version of SQLite + [***the repo***](https://github.com/sql-js/sql.js) 
- export icon CSS by [***gaetanoM***](https://stackoverflow.com/questions/34623447/how-to-create-arrow-down-up-in-css)

## run locally with Node.js

in [***tracker.html***](./html/tracker.html):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js"
        integrity="sha512-Rw3r47C4BVCj/4dy0MiF30B9c7+dLNeJdgPkyw8KiiYqUzAP3XFFw90EjO7mHLkJBl7JCm+/iTuL9dGh47lbMw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer">
</script>

<!-- change lines 21-25 from above to the following: -->

<script src="../node_modules/sql.js/dist/sql-wasm.js"></script>
```

and then in [***drop-zone.js***](./js/tracker/drop-zone.js): 

```js
// update the config to pull from the local package file
const config = {
    locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${filename}`
}

// would become,
const config = {
  locateFile: filename => `../../node_modules/sql.js/dist/${filename}`
}
```