function errorFactory<T extends object>(name: string, customFields?: T) {
  return class extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = name;
      Object.setPrototypeOf(this, new.target.prototype);

      if (customFields) {
        Object.assign(this, customFields);
      }
    }
  };
}

export default errorFactory;
