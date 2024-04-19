import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async (): Promise<object> => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        description: `This documentation specifies the details of the API routes 
        that form the backend of the Management System for ITS.`,
        version: "1.0",
      },
    },
  });
  return spec;
};
