/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // remove field
  collection.fields.removeById("relation988762138")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2881236976",
    "hidden": false,
    "id": "relation988762138",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "charges",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
