function pascalCasesify(str: string): string {
  const start = str.charAt(0);
  return `${start.toUpperCase()}${str.slice(0).toLowerCase()}`;
}

export { pascalCasesify };
