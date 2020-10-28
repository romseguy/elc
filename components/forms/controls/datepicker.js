import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactDatePicker from "react-datepicker";
import { Input, useColorModeValue } from "@chakra-ui/core";

// placeholderText={format(new Date(), "dd/MM/yyyy")}
export const DatePicker = (props) => {
  const color = useColorModeValue("black", "white");
  return (
    <ReactDatePicker
      customInput={<Input />}
      dateFormat="dd/MM/yyyy"
      locale={fr}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      selected={props.value}
      css={{ color }}
      {...props}
    />
  );
};
