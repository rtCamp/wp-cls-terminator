# WP CLS Terminator

Embeds and Iframes often contribute to the Layout Shift, which can be distracting to users and degrades the page experience. This plugin is a POC to eliminate Layout Shifts from WordPress block editor embeds.

## Working
Currently, a setting is provided in the block embed settings, which can help users measure embed dimensions beforehand and add them to block attributes. Later these block attributes can be used to add required dimensions to the embeds and iframes before the page is served to the end user.

![image](https://user-images.githubusercontent.com/54371619/187244974-05941205-0d42-4579-92fe-09b40cd4f6e7.png)
![image](https://user-images.githubusercontent.com/54371619/187245107-cf73638f-7624-4310-8006-31b1008243b7.png)


### How embeds dimensions are measured
When the user clicks on the setting button named `Terminate Layout Shift,` the current block content is rendered into an iframe until it's loaded, and then its respective height and width are measured. This process takes place several times on different viewports to ensure that dimensions are calculated for each device viewport.

## Roadmap
- Currently, terminating the Layout Shift is a manual process, which has to be done for each embed. We are exploring different approaches to make it fully automatic.
- Provide user settings to select viewports for which dimensions should be measured.
