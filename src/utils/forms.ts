import { useState } from "react";

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  console.log("DINS DE USEINPUT === ", value);
  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event: React.SyntheticEvent<Element, Event>) => {
        // @ts-ignore
        setValue(event.target.value);
      },
      required: true,
    },
  };
};

export const useInputNumber = (initialValue: number) => {
  const [value, setValue] = useState(initialValue);

  console.log("DINS DE USEINPUT === ", value);
  return {
    value,
    setValue,
    reset: () => setValue(0),
    bind: {
      value,
      onChange: (event: React.SyntheticEvent<Element, Event>) => {
        // @ts-ignore
        setValue(event.target.value);
      },
      required: true,
    },
  };
};

//ORIGINAL useInputCheckbox
export const useInputCheckbox = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);
  console.log("Dins de useInputCheckbox ===   ", value.toString());
  return {
    value,
    setValue,
    reset: () => setValue(false),
    bind: {
      value,
      onChange: (event: React.SyntheticEvent<Element, Event>) => {
        // @ts-ignore
        
        //setValue(event.target.value);
        //setValue(event.target.value);

        if (event.target.value === "true"){
          setValue(false);
        } else {
          setValue(true);
        }
        
      },
      required: true,
    },
  };
};
