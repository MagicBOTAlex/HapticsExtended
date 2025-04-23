export class MappingFrom {
    constructor(
      public upper: number,
      public lower: number
    ) {}
  
    static fromObject(obj: any): MappingFrom {
      return new MappingFrom(
        Number(obj.upper),
        Number(obj.lower)
      );
    }
  }

export class MappingTo {
    constructor(
      public upper: number,
      public lower: number
    ) {}
  
    static fromObject(obj: any): MappingFrom {
      return new MappingFrom(
        Number(obj.upper),
        Number(obj.lower)
      );
    }
  }
  
export class Mapping {
    constructor(
      public from: MappingFrom,
      public to: MappingTo
    ) {}
  
    static fromObject(obj: any): Mapping {
      return new Mapping(
        MappingFrom.fromObject(obj.from),
        MappingTo.fromObject(obj.to)
      );
    }
  }
  
export class Route {
    constructor(
      public src?: string,
      public dest?: string,
      public mapping?: Mapping
    ) {}
  
    static fromObject(obj: any): Route {
      return new Route(
        String(obj.src),
        String(obj.dest),
        Mapping.fromObject(obj.mapping)
      );
    }
  }