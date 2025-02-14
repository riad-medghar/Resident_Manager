/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_806904202")

  // remove field
  collection.fields.removeById("relation4261298449")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_806904202")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2881236976",
    "hidden": false,
    "id": "relation4261298449",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "charges_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
