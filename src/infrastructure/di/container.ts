// Dependency Injection Container
import { SupabaseLocationRepository } from '../database/supabase/SupabaseLocationRepository';
import { CloudinaryPhotoService } from '../storage/cloudinary/CloudinaryPhotoService';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { GetLocationByQR } from '../../application/use-cases/location/GetLocationByQR';
import { CreateInspection } from '../../application/use-cases/inspection/CreateInspection';
import { UploadPhoto } from '../../application/use-cases/photo/UploadPhoto';

// Repository instances
const locationRepository = new SupabaseLocationRepository();
const photoService = new CloudinaryPhotoService();

// Use case instances
export const loginUserUseCase = new LoginUser(locationRepository);
export const getLocationByQRUseCase = new GetLocationByQR(locationRepository);
export const createInspectionUseCase = new CreateInspection(locationRepository, locationRepository);
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
