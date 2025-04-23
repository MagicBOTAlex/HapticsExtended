export class MappingFrom {
    constructor(
      public upper: number = 1,
      public lower: number = 0
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
      public upper: number = 100,
      public lower: number = 0
    ) {}
  
    static fromObject(obj: any): MappingTo {
      return new MappingTo(
        Number(obj.upper),
        Number(obj.lower)
      );
    }
  }
  
export class Mapping {
    constructor(
      public from: MappingFrom = new MappingFrom(),
      public to: MappingTo = new MappingTo()
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
      public mapping: Mapping = new Mapping()
    ) {}
  
    static fromObject(obj: any): Route {
      return new Route(
        String(obj.src),
        String(obj.dest),
        Mapping.fromObject(obj.mapping)
      );
    }
  }