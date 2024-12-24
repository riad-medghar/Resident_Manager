/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // remove field
  collection.fields.removeById("autodate3769133984")

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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "autodate3769133984",
    "name": "move_in_datee",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("date2255381704")

  return app.save(collection)
})
