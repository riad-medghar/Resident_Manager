/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_806904202")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "date3334985220",
    "max": "",
    "min": "",
    "name": "evicted_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_806904202")

  // remove field
  collection.fields.removeById("date3334985220")

  return app.save(collection)
})
