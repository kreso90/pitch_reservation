import { FacilityWithFields } from '@/types/facilityData';
import React from 'react'

type FieldsProps = {
    facilityData: FacilityWithFields | null;
};

export const Fields = ({facilityData}: FieldsProps) => {
  return (
    <div>Fields</div>
  )
}
