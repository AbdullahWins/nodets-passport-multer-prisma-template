import { renderTemplate } from "./handlebar.service"; // Adjust the import path as necessary
import fs from "fs";
import handlebars from "handlebars";
import path from "path";

jest.mock("fs");
jest.mock("handlebars");

describe("Email Service", () => {
  const mockTemplateName = "welcome";
  const mockData = { name: "John" };
  const mockTemplateContent = "<h1>Welcome, {{name}}!</h1>";
  const mockCompiledTemplate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("renderTemplate", () => {
    it("should render the template with the provided data", () => {
      // Mock the readFileSync to return the template content
      (fs.readFileSync as jest.Mock).mockReturnValue(mockTemplateContent);
      // Mock handlebars.compile to return a compiled template function
      (handlebars.compile as jest.Mock).mockReturnValue(mockCompiledTemplate);

      // Mock the implementation of the compiled template function
      mockCompiledTemplate.mockReturnValue("<h1>Welcome, John!</h1>");

      const result = renderTemplate(mockTemplateName, mockData);

      // Use path.join to create the expected file path
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(
          process.cwd(),
          "src",
          "views",
          "emails",
          `${mockTemplateName}.hbs`
        ),
        "utf8"
      );
      expect(handlebars.compile).toHaveBeenCalledWith(mockTemplateContent);
      expect(mockCompiledTemplate).toHaveBeenCalledWith(mockData);
      expect(result).toBe("<h1>Welcome, John!</h1>");
    });

    it("should throw an error if the template file is not found", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("Template not found");
      });

      expect(() => renderTemplate(mockTemplateName, mockData)).toThrow(
        "Template not found"
      );

      // Use path.join to create the expected file path
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(
          process.cwd(),
          "src",
          "views",
          "emails",
          `${mockTemplateName}.hbs`
        ),
        "utf8"
      );
    });
  });
});
