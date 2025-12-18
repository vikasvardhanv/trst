import React from 'react';
import { Stethoscope, HardHat, Car, Utensils, Scissors } from 'lucide-react';

export const ClinicIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Stethoscope className={className} />
);

export const ConstructionIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <HardHat className={className} />
);

export const DealershipIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Car className={className} />
);

export const RestaurantIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Utensils className={className} />
);

export const SalonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Scissors className={className} />
);
