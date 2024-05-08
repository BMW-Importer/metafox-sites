# How to Build/Develop your first Block component

## Pre-requisites

1. Kindly ensure that you have gone through the [set up guides](set-up_guide_fe.md).
2. Kindly ensure that you are aware of the [FAQ's](faqs.md) and the [Build](build_and_deploy.md) docs
3. Kindly make sure that the Sandbox is up and running !
4. Its also highly recommended to go through the documentation on [aem live](https://www.aem.live/docs/#build)

## Steps to create a new component

### Create a basic component - Definition & its dialog properties


1. In this document we would like to show you how to create a custom block component named text-image.
2. One can use this as an example to create more blocks.
3. Fistly define the block on the Component-definition.json
```json
   
   {
          "title": "Text-Image",
          "id": "text-image",
          "plugins": {
            "xwalk": {
              "page": {
                "resourceType": "core/franklin/components/block/v1/block",
                "template": {
                  "name": "text-image",
                  "model": "text-image"
                }
              }
            }
          }
        }
   ```
4. Note that the resource type should be `core/franklin/components/block/v1/block`
5. Next step is to define the component properties in the component-models.json
6. The code to include for text image component is as below
```json
   {
    "id": "text-image",
    "fields": [
      {
        "component": "reference",
        "valueType": "string",
        "name": "image",
        "label": "Image",
        "multi": false
      },
      {
        "component": "text-input",
        "valueType": "string",
        "name": "imageAlt",
        "label": "Alt text",
        "value": ""
      },
      {
        "component": "text-area",
        "name": "text",
        "value": "",
        "label": "Text",
        "valueType": "string"
      },
      {
        "component": "select",
        "name": "imagePosition",
        "filter": "imagePosition",
        "value": "",
        "label": "Image Position",
        "valueType": "string",
        "options": [
          {
            "name": "Left",
            "value": "left"
          },
          {
            "name": "Right",
            "value": "right"
          }
        ]
      }
    ]
   } 
   ```
7. The next step is to add it in a filter (It is a place where we define the group where the component appears). Also if needed, it is here where we define if we need to allow another component under this created component.
Below example to add the newly created component (text-image) under the section
```json
  {
    "id": "section",
    "components": [
      "text",
      "image",
      "button",
      "title",
      "hero",
      "cards",
      "columns",
      "text-image"
    ]
  }
   ```
   Below an example of allowing another component under text-image component
   ```json
   {
    "id": "text-image",
    "components": [
      "text",
      "image",
      "button"
    ]
  },
   ```
### Component styles & scripts
The Component styles & scripts can be defined in the blocks section (within the blocks folder)
eg. a new folder named "text-image" has been created to hold the 2 files 
* [text-image.css](https://github.com/Harish-deva/x-walk/blob/main/blocks/text-image/text-image.css)
* [text-image.js](https://github.com/Harish-deva/x-walk/blob/main/blocks/text-image/text-image.js)

Post making all the changes the outcome can be seen like this, 
Text Image component with left aligned image 
![](../resources/text-image-left.png)

Text Image component with right aligned image
![](../resources/text-image-right.png)

Kindly refer the [examples](https://github.com/adobe-experience-league/exlm/tree/56a35accfd904e3636b42262e50f0f508683fd47/blocks) from Adobe that has quite a lot of component examples. 

### Types of components

1. Blocks (Content based components - image , text , buttons etc.)
2. Section (Similar to container)
