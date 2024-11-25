import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { PropertyTypeModal } from '../model/PropertyType.js';

// Promisify fs methods to use async/await
const stat = util.promisify(fs.stat);
const rename = util.promisify(fs.rename);


// Create directories if they do not exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Reusable function to move images from one folder to another.
 * 
 * @param {Array} documents - List of documents from MongoDB.
 * @param {String} field - The field containing the image link in the document.
 * @param {String} sourceFolder - The folder where the images are currently stored.
 * @param {String} destinationFolder - The folder where the images should be moved.
 */
export async function moveImages(documents, field, sourceFolder, destinationFolder) {
    // Ensure the destination folder exists
    ensureDirectoryExists(destinationFolder);

    for (const doc of documents) {
        const oldImagePath = path.join(sourceFolder, doc[field]);
        const newImagePath = path.join(destinationFolder, doc[field]);

        try {
            await stat(oldImagePath); // Check if the image exists

            // Move the image to the new folder
            await rename(oldImagePath, newImagePath);
            console.log(`Moved ${doc[field]} to new folder.`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`Image ${doc[field]} does not exist in the old folder.`);
            } else {
                console.error(`Error checking or moving file ${doc[field]}:`, err);
            }
        }
    }
}

/**
 * Function to fetch all property types and move their images.
 */
export async function movePropertyTypeImages() {
    try {
        // Step 1: Fetch all property types
        const propertyTypes = await PropertyTypeModal.find({});

        // Step 2: Move images from old folder to new folder
        await moveImages(
            propertyTypes, // Array of documents
            'imageLink', // Field containing the image link
            path.join(process.cwd(), 'uploads', 'mainImage'), // Source folder
            path.join(process.cwd(), 'uploads', 'property-type-image') // Destination folder
        );

        console.log('Image migration completed.');
    } catch (error) {
        console.error('Error fetching property types:', error);
    }
}
