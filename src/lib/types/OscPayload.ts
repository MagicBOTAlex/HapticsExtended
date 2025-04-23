// You would not belive how much vibed this is

// 1. Raw payload type stays the same:
export type RawOscPayload = {
    address: string
    args: string[]   // e.g. ["String(\"hello\")", "Float(22.0)", "Bool(true)"]
  }
  
  // 2. A generic unwrap function:
  function unwrapRustValue(raw: string): string | number | boolean {
    const m = /^(\w+)\((.*)\)$/.exec(raw)
    if (!m) {
      // not wrapped, return as-is
      return raw
    }
  
    const [, typ, inner] = m
    switch (typ) {
      case 'String':
        // strip the surrounding quotes and unescape any \" inside
        return inner.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"')
      case 'Float':
      case 'Double':
        return parseFloat(inner)
      case 'Int':
      case 'Long':
        return parseInt(inner, 10)
      case 'Bool':
        return inner === 'true'
      default:
        // unknown wrapper, return the inner text
        return inner
    }
  }
  
  // 3. Your TS class adjusted to hold mixed types:
  export class OscPayload {
    constructor(
      public address: string,
      public args: (string | number | boolean)[]
    ) {}
  
    describe() {
      return `Address: ${this.address}, Args: ${this.args.join(', ')}`
    }
  
    static fromRaw(raw: RawOscPayload) {
      const unwrapped = raw.args.map(unwrapRustValue)
      return new OscPayload(raw.address, unwrapped)
    }
  }
  