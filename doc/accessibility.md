Accessibility
=============

As of this writing (in July of 2024), accessibility (aka a11y) strings that are created for description and voicing are
not translatable, but because we hope to support translation of these strings someday, we store them in the same file
as the translatable strings.  In order to clearly identify the strings as a11y related, and thus not something that
should be presented in the translation utility, they are nested under the `a11y` key in the strings file. To illustrate,
here is an excerpt from the Greenhouse Effect strings file greenhouse-effect-strings_en.json:

```json
  "absorbingLayers": {
    "value": "Absorbing Layers"
  },
  "temperatureUnits": {
    "value": "Temperature Units"
  },
  "a11y": {
    "observationWindowLabel": {
      "value": "Observation Window"
    },
    "energyBalance": {
      "accessibleHelpText": {
        "value": "Measure incoming and outgoing energy at top of atmosphere."
      }
    },
    .
    .
    .
```

There is a question that naturally arises for developers when using this approach and adding strings for a11y-related
features: If there is a string that is needed for a11y that already exists in the translatable strings, is it okay to
just use it, or should a separate string with the same value be added under the a11y key?  This was discussed in the
7/15/2024 developer meeting, and we agreed that yes, it is okay to use the translatable version of the string.  The
rationale here is that it would be better than nothing if a partial translation is ever needed, and it would help to
avoid duplicated information.  We are aware that this may be a bit more tricky if we ever have to fully separate the
a11y and non-a11y strings in the future, but we're willing to live with that for now.
