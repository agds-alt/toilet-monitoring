// Repository Interface: ILocationRepository
import { LocationEntity } from '../../../domain/entities/Location';

export interface ILocationRepository {
  findById(id: string): Promise<LocationEntity | null>;
  findByCode(code: string): Promise<LocationEntity | null>;
  findByQRCode(qrCode: string): Promise<LocationEntity | null>;
  findAll(): Promise<LocationEntity[]>;
  findByBuilding(building: string): Promise<LocationEntity[]>;
  findByFloor(floor: string): Promise<LocationEntity[]>;
  create(location: LocationEntity): Promise<LocationEntity>;
  update(location: LocationEntity): Promise<LocationEntity>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<LocationEntity[]>;
}
