
import swaggerJSDoc from 'swagger-jsdoc';

const options ={
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HNG13 stage 1 API',
            version: '1.0.0',
            description: 'String analyzer system api',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
            {
                url:'https://string-analyzer-system-api-production.up.railway.app',
                description:'Pro server'
            }
        ],
    },
    apis: ['./src/routes/*.ts', './src/model/*.ts'], // Path to the API docs
}
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
