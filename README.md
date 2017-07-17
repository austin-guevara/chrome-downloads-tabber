# chrome-downloads-tabber
Instead of opening the downloads tray, new downloads in chrome will open 'chrome://downloads' in a new tab.

Contributions are welcome; currently the extensions is unable to _activate_ the downloads tab if it is already open, resulting in multiple downloads tabs. Also, the downloads tab opens before a download is confirmed. So we may need to use a more reliable flag than downloadsDidChange as that is triggered by the "Save as..." dialog.
