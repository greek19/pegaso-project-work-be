import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Application } from "express";
import path from "path";

export function setupSwagger(app: Application): void {
    const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
