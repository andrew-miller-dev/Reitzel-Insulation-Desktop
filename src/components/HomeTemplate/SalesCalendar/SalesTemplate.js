import React from 'react';


export default function SalesTemplate(model) {
  const { appointmentData } = model.data;
  return (
    <div>
        <div>
        {appointmentData.text}
        </div>
    </div>
  );
}