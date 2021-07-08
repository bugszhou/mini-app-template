import { genPreCSSTpl, genUsuallyTpl, genClassWeappTpl, genClassAliappTpl } from "./create";
const processor: any = {
  aliapp: {
    genPreCSSTpl,
    genUsuallyTpl,
  },
  weapp: {
    genPreCSSTpl,
    genUsuallyTpl,
  },
  weappClass: {
    genPreCSSTpl,
    genUsuallyTpl: genClassWeappTpl,
  },
  aliappClass: {
    genPreCSSTpl,
    genUsuallyTpl: genClassAliappTpl,
  }
};

export default processor;
