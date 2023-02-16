# Sample Plugin

The branches in this repo show building various functionality in an Obsidian Plugin using my base classes from https://github.com/derammo/derobst.

# 1. An Inline Command

This code adds the ability to detect inline code blocks like `` `!foo` ``.

In live preview mode, this command causes a button to be shown.  

https://github.com/derammo/obsidian-derammo-sample/compare/InlineFoo

# 2. Adding Auto-Hide to the Command

This code adds the functionality of the inline code being hidden (or dimmed) when it is not being edited.  In "Reading" markdown view, it is always hidden.  This code also demonstrates how to use a plugin setting to control the hiding or dimming, and update the view live when the setting is changed.

https://github.com/derammo/obsidian-derammo-sample/compare/InlineFoo...InlineFooAutoHide
