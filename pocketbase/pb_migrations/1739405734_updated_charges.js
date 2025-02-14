/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2881236976")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json1932714345",
    "maxSize": 0,
    "name": "services",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2881236976")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json1932714345",
    "maxSize": 0,
    "name": "services",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
