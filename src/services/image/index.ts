
// Re-export all image service functions
export { uploadFoodImage } from './uploadService';
export { addFoodImage, getFoodImages } from './databaseService';
export { deleteFoodImage, setPrimaryFoodImage } from './managementService';
export { BUCKET_NAME } from './constants';
