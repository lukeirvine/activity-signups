export const createSelectChangeEvent = (
  value: string | string[],
  name: string,
) => {
  const event = {
    target: {
      value: value,
      name: name,
    },
    preventDefault: () => {},
    stopPropagation: () => {},
  } as React.ChangeEvent<HTMLSelectElement>;

  return event;
};

export const createTextChangeEvent = (
  value: string | undefined,
  name: string,
) => {
  const event = {
    target: {
      value: value,
      name: name,
    },
    preventDefault: () => {},
    stopPropagation: () => {},
  } as React.ChangeEvent<HTMLInputElement>;

  return event;
};
