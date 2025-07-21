# ContactManagerAngular
Make the Add Form styled the same as the Update Form. *** Done ***
 
Test adding a contact with valid data. *** Done ***
 
Test adding a contact with empty data. *** Done *** No record added, simply stays on the Add Contact Page
 
Test adding a duplicate contact. *** Done *** duplicate of contact was added. Image was not duplicated in the uploads folder on the backend which is good. Adding the duplicate will need to be corrected. When deleting the duplicate contact the image was deleted from the uploads folder. *** Action Item: do not allow duplicate emails and do not allow duplicate images. We also want to prevent duplicate emails and images when we update a contact. *** Testing suggested changes reveals that a duplicate email and a non duplicate imageName results in no contact added which is great but it uploads image which itshould not. Further suggestion to not upload immediately resulted in desired behavior for Add Contact. After suggested changes to prevent the use of either a duplicate email address or a duplicate image during the update process it works as expected. There is an issue with the Cancel which is identified elsewhere as an Action Item and will be addressed when tending to this later Actipn Item.
 
Test adding an invalid file format for the image. *** Done *** Added new contact and invalid file which ultimately leads to an issue with the img tag in the contact list. File is added to uploads folder and imageName column in database.
 
Add a confirmation before deleting. *** Done *** works fine.
 
Test updating with valid data. *** Done *** Updated successfully.
 
Test updating with empty data.*** Done *** Update and Cancel buttons disabled if any field is empty.
 
Test updating with invalid data.  *** Done *** Allows birthdate in the future.  Allows invalid phone and invalid email formats.  *** Action Item: resolve identified issues. ***
 
Test adding contact with non-numeric phone number
 
Test updating the image with an invalid file type. *** Done ** Allows updating with invalid file format.  *** Action Item: Do not allow invalid file types. ***
 
Test deleting a contact. *** Done *** Successfully deleted contact and removed image.
 
Test that Contact list displays correctly. *** Done *** List displays correctly but could maybe use some more polished CSS.  *** Action Item: Add additional CSS. *** *** Done, added CSS to give a card like appearance with Bootstrap styles. ***
 
Test that Contact list updates appropriately when adding contact. *** Done *** List updates appropriately.
 
Test that Contact list updates appropriately when updating a contact. *** Done *** List updates appropriately.
 
Test maximum allowed characters for fields
 
If we go to the Update Form and change data including the image and then click on the Cancel Button does the cancel execute without a change to the contact including the image not changed or deleted image added in the uploads folder. *** Done *** After making changes including the image when we click on Cancel the record updates when it shouldn't and the new image is added to the uploads folder and the original is deleted despite clicking on Cancel. *** Action Item: resolve identified issues. ***
 
https://chatgpt.com/share/6862ad4e-acb0-8007-a667-3a3c6b1805a3
ChatGPT - Component Naming Guide
Shared via ChatGPT
 
Add capability to select TypeID when adding or updating contacts.
 
Break time until 10AM.
 
Test maximum allowed characters for fields. *** Done *** Generated Error Code 500 at line 34 in addcontacts.ts no record was added to the database. Likely need to check character length before attempting add. *** Action Item: Resolve identified issues. ***
 
Test when adding a new contact if we select one image then select a different image and then click Add Contact. *** Done *** Image and record are not added until clicking on Add Contact. *** Action Item: Add ability to select contact type. *** *** Now allows selecting a contact type from a dropdown list when adding a new contact. An additional Action Item would be to now add the ability to edit the contact type. ***
 
Test when adding a contact what happens when filling in the form and selecting an image file and then clicking on Cancel. *** Done *** No record is added, no image is added to uploads. Behavior is as expected.
 
https://chatgpt.com/share/6862ad4e-acb0-8007-a667-3a3c6b1805a3
ChatGPT - Component Naming Guide
Shared via ChatGPT
 