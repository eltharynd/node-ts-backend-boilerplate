export default abstract class Validatable<T> {
  values: { [field: string]: any } = {}
  fields: string[]

  constructor(fields: string[]) {
    this.fields = fields
    for (let field of this.fields) {
      this.values[field] = fields[field]
    }
  }

  isValid(): {
    valid: boolean
    missing: { fields: string[]; reason: string; current: any }[]
  } {
    let missing: { fields: string[]; reason: string; current: any }[] =
      this.fields
        .filter((f) => !(this.values[f] == 0 || !!this.values[f]))
        .map((f) => {
          return { fields: [f], reason: f, current: this.values[f] }
        })
    return {
      valid: missing.length <= 0,
      missing,
    }
  }

  toJSON(childrenFields: { [field: string]: any }): Partial<T> {
    let buffer: any = {
      ...childrenFields,
    }
    this.fields.forEach((f) => (buffer[f] = this.values[f]))
    return buffer
  }
}
