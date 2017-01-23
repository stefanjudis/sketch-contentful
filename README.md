# sketch-contentful
A Sketch App plugin to populate your documents with data stored in Contentful.

![Workflow with Sketch Contentful](./sketch-contentful.gif)

## Setup

Download the latest version of the Sketch plugin from the [releases page](https://github.com/stefanjudis/sketch-contentful/releases). Install the plugin by double clicking on the `.sketch` file.
That's it. Now it's installed. :)

## Define space and CDA token

To access data from Contentful you have to define the particular space where the data is stored and the depending CDA token so that the requests can be authorized.

## Connect TextLayers to Contentful

To connect your layers with Contentful you have to:

- group all layers that belong to one entry
- include entry identifier in name of this group `Your layer {entry:ENTRY_ID}` -> `Your layer {entry:fhdjasklfh7e2q90rfjweq9f8jeq9}`
- all TextLayers inside of this group can now be connected to fields
- include field itendifier in name of the Text layer `My title {fields:FIELD_NAME}` -> `My title {fields:title}`

A the layers of a document could be as follows to make it work.

```
Author {entry:fjsdaklfsjf8239qr}         // a Group
  |__ Title {fields:title}               // a TextLayer
  |__ Description {fields:description}   // a TextLayer
  |
```

Now your able to fetch the recent data from Contentful and populate the data.

