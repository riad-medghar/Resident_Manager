/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // remove field
  collection.fields.removeById("date1927859785")

  // remove field
  collection.fields.removeById("date2255381704")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "date1927859785",
    "max": "",
    "min": "",
    "name": "move_in_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "date2255381704",
    "max": "",
    "min": "",
    "name": "move_out_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
