// Dependency Injection Container
import { SupabaseLocationRepository } from '../database/repositories/SupabaseLocationRepository';
import { SupabaseUserRepository } from '../database/repositories/SupabaseUserRepository';
import { CloudinaryPhotoService } from '../storage/cloudinary/CloudinaryPhotoService';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { GetLocationByQR } from '../../application/use-cases/location/GetLocationByQR';
import { CreateInspection } from '../../application/use-cases/inspection/CreateInspection';
import { UploadPhoto } from '../../application/use-cases/photo/UploadPhoto';

// Repository instances
const locationRepository = new SupabaseLocationRepository();
const userRepository = new SupabaseUserRepository();
const photoService = new CloudinaryPhotoService();

// Use case instances
export const loginUserUseCase = new LoginUser(userRepository as any);
export const getLocationByQRUseCase = new GetLocationByQR(locationRepository as any);
export const createInspectionUseCase = new CreateInspection(locationRepository as any, locationRepository as any);
export const uploadPhotoUseCase = new UploadPhoto(photoService);

// Export all dependencies
export const container = {
  repositories: {
    location: locationRepository,
  },
  services: {
    photo: photoService,
  },
  useCases: {
    loginUser: loginUserUseCase,
    getLocationByQR: getLocationByQRUseCase,
    createInspection: createInspectionUseCase,
    uploadPhoto: uploadPhotoUseCase,
  },
};
