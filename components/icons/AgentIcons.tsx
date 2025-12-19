import React from 'react';
import { Stethoscope, HardHat, Car, Utensils, Scissors, Home, Scale, ShoppingBag, GraduationCap, Users } from 'lucide-react';

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

export const RealEstateIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Home className={className} />
);

export const LegalIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Scale className={className} />
);

export const EcommerceIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <ShoppingBag className={className} />
);

export const EducationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <GraduationCap className={className} />
);

export const RecruitmentIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Users className={className} />
);
