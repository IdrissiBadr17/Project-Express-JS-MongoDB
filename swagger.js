import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tour API",
      version: "1.0.0",
      description: "API documentation for the Tour API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./router/*.js"], // make sure folder name is correct
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;