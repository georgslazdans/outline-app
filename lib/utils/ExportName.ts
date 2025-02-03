const exportNameOf = (name: string) => {
  return name.toLowerCase().replaceAll(" ", "_");
};

export default exportNameOf;
