
# Import Data

Create a csv or excel file with example data like the following. 

<img src="assets\image-20230910143248692.jpg" alt="image-20230910143248692" style="zoom:50%;" />

Now click on the *Choose File* button (alternatively drag and drop your file onto the button). The data will be plotted and should look like this: 

<img src="assets\image-20230910143654109.jpg" alt="image-20230910143654109" style="zoom:50%;" />

# Change the axis labels

Under the *Layout* section, click on *xaxis* the *title*. You should see this:

<img src="assets\image-20230910143916568.jpg" alt="image-20230910143916568" style="zoom:50%;" />

You can click on *xaxis* again to collapse the section. Repeat for the y axis.

# Set Legend

The legend is automatically shown, it can be toggled on/off with the *Showlegend* checkbox. Each data series is shown under the *Data* section on the right of the page. For now we just have the *y* series. Lets rename to *$x^2$*. Type this "x\<sup>2\</sup>"  into the *name*:

<img src="assets\image-20230910144408872.jpg" alt="image-20230910144408872" style="zoom:50%;" />

# Markers, Lines, or Markers and Lines

Lets show each datapoint and keep the line for this dataseries. Under *Data*, *mode* select the *lines+markers* from the dropdown.

<img src="assets\image-20230910144713416.jpg" alt="image-20230910144713416" style="zoom:50%;" />

# Resize Plot

Lets make this a rectangle. Under the *Layout* section, change the margins for the bottom, left, right and top and the total width and height of the plot as shown below:

<img src="assets\image-20230910144930273.jpg" alt="image-20230910144930273" style="zoom:50%;" />

# Line and Marker Styles 

Update the line style and the marker styles under the *Data* section as shown below: 

<img src="assets\image-20230910145145553.jpg" alt="image-20230910145145553" style="zoom:50%;" />

The plot should look like this: 

<img src="assets\image-20230910145351650.jpg" alt="image-20230910145351650" style="zoom:50%;" />



# Templates 

You can save this plotting style as a template by clicking on the *Save Template* button. The template is saved by your browser. Refresh the page and reupload the data to the *Choose File*  button. Under Choose Template click on the template you just saved. Your plot should go from the default formatting to include the styles we just set up.



# Multiple Data Series 

Create a csv or excel file with multiple data series formatted like such: 

![image-20230910145922158](assets\image-20230910145922158.jpg)

Or if they all share the same x data: 

<img src="assets\image-20230910150027376.jpg" alt="image-20230910150027376" style="zoom:50%;" />

Upload this file as before. The default plot should look like this:

<img src="assets\image-20230910150212648.jpg" alt="image-20230910150212648" style="zoom:50%;" />

The data series styles can be adjusted individually as shown above. Alternatively, they can all be updated at the same time with the *Master Trace* style.  Here is an example and resulting plot: 

<img src="assets\image-20230910150520350.jpg" alt="image-20230910150520350" style="zoom:50%;" />

<img src="assets\image-20230910150549039.jpg" alt="image-20230910150549039" style="zoom:50%;" />

# Changing Colors

Just above the *Layout* button, the color scheme can be changed and the colors for each series are changed in accordance with their matching color in the color scheme. For example lets use the *tab20* scheme.   

<img src="assets\image-20230910151115225.jpg" alt="image-20230910151115225" style="zoom:50%;" />

It will look like this 

<img src="assets\image-20230910151218060.jpg" alt="image-20230910151218060" style="zoom:50%;" />

We can choose a sequential color scheme (the number of colors within the sequence is set by *n_colors*). Try *Viridis, Magma, Plasma,* etc. I will set as *Magma_r_* (reverse magma).

# Log scale 

Lets make this a log-log scale. We can do this by setting *type* to *log* for both *xaxis* and *yaxis*. As shown below I set the range from (0,1); note these are on the log scale. 

# Tick styles 

To only show the ticks every order of 1. Set *dtick* to 1 (again, this is logscale).  

# Moving the Legend

The legend can be moved with the *x* and *y* under the *Layout, legend*.  

<img src="assets/image-20230910152350013.jpg" alt="image-20230910152350013" style="zoom:50%;" />

If you made all the changes noted above, the plot should look like this:

<img src="assets/image-20230910152438719.jpg" alt="image-20230910152438719" style="zoom:50%;" />



# Export Plot



Within the plot region. Click on the button for either exporting as SVG or PNG:

<img src="assets\image-20230910150812733.jpg" alt="image-20230910150812733" style="zoom:50%;" />

SVG formatting is useful if you open in Inkscape to do any final formatting. PNG is useful for placing directly into a document. Note the PNG is upscaled 8 times to improve resolution; the actual size in pixels is the *width* and *height*  set in the *Layout* section.   