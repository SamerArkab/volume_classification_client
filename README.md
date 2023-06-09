You can find more details about the models for classification, volume estimation, and segmentation [here](https://github.com/SamerArkab/Final_Proj_Volume_Classification)<br>
 You can find the server-side [here](https://github.com/SamerArkab/volume_classification_server)
 
 # Label Volume Nutrition

A web application for food nutrition analysis based on images. Built with React and uses React Bootstrap for styling. The application interacts with a server to fetch image data and nutrition labels.

## Usage

This application has been deployed to [Vercel](https://volume-classification-client.vercel.app/).
The server-side has also been deployed. But to fully use this application one will need to contact me to activate the containers in GCP (they're deactivated from running idly).

## Application Overview

The application has three main screens:

### `Home`

In the home screen, users can upload an image of the food they want to analyze. Once the image is uploaded, the app will send the image to the server for processing.

### `SegmentsAndLabel`

Once the processing is done, users will be navigated to the `SegmentsAndLabel` screen. In this screen, the processed image will be displayed. The image will be segmented and each segment will be associated with a label indicating the food item in that segment. The users can navigate through different segmented images, delete any incorrect segmentation, and edit the labels if necessary.

### `DisplayResults`

Finally, once all segments are verified, the application will navigate to the `DisplayResults` screen where the total nutrition information is displayed. The result includes the sum of Calories, Fat, Cholesterol, Sodium, Carbohydrates, Sugars, and Protein for all segments in the image.

## Example Run

https://github.com/SamerArkab/volume_classification_client/assets/80578540/b62d15da-3731-4ddd-8895-61ba68503803


https://github.com/SamerArkab/volume_classification_client/assets/80578540/20cefc7f-60ab-49fd-83f7-6c1b302511a8

