import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { PropertyTypeModal } from '../model/PropertyType.js';

// Function to generate a new unique file name based on the created date
const generateFileName = (file, createdDate) => {
    const date = new Date(createdDate);

    // Format the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Extract the file extension
    const extension = path.extname(file);

    // Create the unique file name
    const uniqueSuffix = Math.round(Math.random() * 1e9); // Unique number
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}-${uniqueSuffix}${extension}`;
};

/**
 * Function to rename existing images based on the image link from the database.
 */
export const renamePropertyTypeImages = async () => {
    try {
        // Step 1: Fetch all property types
        const propertyTypes = await PropertyTypeModal.find({});

        for (const propertyType of propertyTypes) {
            try {
                const oldImagePath = path.join(process.cwd(), 'uploads', 'property-type-image', propertyType.imageLink);

                // Step 2: Check if the old image file exists
                if (fs.existsSync(oldImagePath)) {
                    // Step 3: Generate a new file name based on the created date
                    const newFileName = generateFileName(propertyType.imageLink, propertyType.createdAt);
                    const newImagePath = path.join(process.cwd(), 'uploads', 'property-type-image', newFileName);

                    // Step 4: Rename the old image to the new image name
                    fs.renameSync(oldImagePath, newImagePath);
                    console.log(`Renamed ${propertyType.imageLink} to ${newFileName}`);

                    // Step 5: Update the database with the new image link
                    propertyType.imageLink = newFileName; // Update the imageLink field
                    await propertyType.save(); // Save the updated document
                } else {
                    console.log(`Image ${propertyType.imageLink} does not exist.`);
                }
            } catch (err) {
                console.error(`Error processing image for property type ${propertyType._id}:`, err);
            }
        }

        console.log('Image renaming process completed.');
    } catch (error) {
        console.error('Error fetching property types:', error);
    }
};
