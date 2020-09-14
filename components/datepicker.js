import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactDatePicker from "react-datepicker";
import { Input } from "@chakra-ui/core";

export const DatePicker = (props) => {
  return (
    <ReactDatePicker
      customInput={<Input />}
      dateFormat="dd/MM/yyyy"
      locale={fr}
      placeholderText={format(new Date(), "dd/MM/yyyy")}
      onBlur={props.onBlur}
      onChange={props.onChange}
      selected={props.value}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
};
