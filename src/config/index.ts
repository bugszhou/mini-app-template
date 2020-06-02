import { join } from "path";

interface IConfig {
  readonly pageTemplatePath: string;
  readonly componentTemplatePath: string;
}

const config: IConfig = {
  pageTemplatePath: join(__dirname, "../template/page"),
  componentTemplatePath: join(__dirname, "../template/component"),
};

export default config;
