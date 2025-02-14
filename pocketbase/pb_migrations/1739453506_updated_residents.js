/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // remove field
  collection.fields.removeById("relation2141667686")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // add field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2881236976",
    "hidden": false,
    "id": "relation2141667686",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "charges_list",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
