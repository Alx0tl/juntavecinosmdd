import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendario = ({ onDateChange }) => {
  console.log("Calendario montado");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div>
      <label>Selecciona la fecha de la asamblea:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        placeholderText="Elige una fecha"
      />
    </div>
  );
};

export default Calendario;