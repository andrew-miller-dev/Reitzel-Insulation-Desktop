import React from 'react';

const {format} = require('date-fns-tz');


export default function FillTemplate(model) {
  const { appointmentData } = model.data;
  return (
    <div>
      <p>{`${format(new Date(appointmentData.startDate),"h':'mm aa")} - ${format(new Date(appointmentData.endDate),"h':'mm aa")}`}</p>
    </div>
  );
}