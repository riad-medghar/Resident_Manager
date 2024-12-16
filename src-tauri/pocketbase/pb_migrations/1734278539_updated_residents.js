/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "file3647370773",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "Picture",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // remove field
  collection.fields.removeById("file3647370773")

  return app.save(collection)
})
