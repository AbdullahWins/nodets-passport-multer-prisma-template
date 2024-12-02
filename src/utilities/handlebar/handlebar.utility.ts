// src/services/handlebar/handlebar.service.ts
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

export const renderTemplate = (templateName: string, data: object) => {
  const filePath = path.resolve(
    process.cwd(),
    "src",
    "views",
    "emails",
    `${templateName}.hbs`
  );
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template(data);
};
