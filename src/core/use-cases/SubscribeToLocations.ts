// ===================================
// 📁 src/core/use-cases/SubscribeToLocations.ts
// ===================================
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location } from '@/core/entities/Location';

export class SubscribeToLocations {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(callback: (locations: Location[]) => void): Promise<() => void> {
    try {
      console.log('🔔 Setting up location subscription...');

      // Initial fetch
      const initialLocations = await this.locationRepository.findAll();
      callback(initialLocations);

      // TODO: Implement real-time subscription if using Supabase Realtime
      // const subscription = supabase
      //   .channel('locations')
      //   .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, (payload) => {
      //     this.locationRepository.findAll().then(callback);
      //   })
      //   .subscribe();

      // Return unsubscribe function
      const unsubscribe = () => {
        console.log('🔕 Unsubscribed from locations');
        // subscription.unsubscribe();
      };

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error in SubscribeToLocations use case:', error);
      throw error;
    }
  }
}
