export const addCopyName = (name: string): string => {
  const copyRegex = /( - Copy)( \((\d+)\))?$/;

  if (!copyRegex.test(name)) {
    return `${name} - Copy`;
  }

  return name.replace(copyRegex, (_, copyText, suffix, number) => {
    const nextNumber = number ? parseInt(number, 10) + 1 : 2;
    return `${copyText} (${nextNumber})`;
  });
};
