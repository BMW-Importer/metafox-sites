# Elemenatal Grouping
***

1. When creating a component, the fields created for each component in the component-models can be named with prefix and/or suffix included.
2. When grouping is done by adding the prefix, these fields can be styled together easily in the css. Basically this is done for FE styling. 
Refer below example where group is done using prefix
```json
{
    "id": "text-image-v2",
    "fields": [
{
        "component": "text-area",
        "name": "fg_details",
        "value": "",
        "label": "Text",
        "description": "Optional text for the text image component",
        "placeholder": "Please provide some text of your choice here!",
        "valueType": "string"
      },
      {
        "component": "text",
        "name": "fg_summary",
        "value": "",
        "label": "Summary",
        "description": "Optional text for the text image component",
        "placeholder": "Please provide some text for summary!",
        "valueType": "string"
      }
    ]
}
```
Refer below the screenshot of the HTML generated
![](image.png)
3. When grouping is done by adding the suffix, these fields are grouped together in authoring instance for easy authoring.
Refer below example where group is done using suffix
```json
{
    "id": "text-image-v2",
    "fields": [
      {
        "component": "reference",
        "valueType": "string",
        "name": "bg_fileReference",
        "label": "Image",
        "value": "",
        "description": "Image path from AEM DAM - only choose from the dedicated asset folder",
        "multi": false
      },
      {
        "component": "text-input",
        "valueType": "string",
        "name": "bg_fileReferenceAlt",
        "label": "Alt text",
        "description": "Image alt text - highly recommended for SEO",
        "value": ""
      }
    ]
}
```
Refer below screenshot from Authoring instance
![](image-1.png)