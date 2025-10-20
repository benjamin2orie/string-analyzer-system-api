import { Router } from "express";
import { StringController } from "../controllers/string.controller.js";

const router = Router();


/**
 * @openapi
 * /strings/filter-by-natural-language:
 *   get:
 *     summary: Filter strings using natural language query
 *     tags: [analyzer]
 *     description: Parses a natural language query and returns matching strings based on interpreted filters.
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "all single word palindromic strings"
 *     responses:
 *       '200':
 *         description: Matching strings found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21"
 *                       value:
 *                         type: string
 *                         example: "madam"
 *                       properties:
 *                         type: object
 *                         properties:
 *                           length:
 *                             type: integer
 *                             example: 5
 *                           is_palindrome:
 *                             type: boolean
 *                             example: true
 *                           unique_characters:
 *                             type: integer
 *                             example: 3
 *                           word_count:
 *                             type: integer
 *                             example: 1
 *                           sha256_hash:
 *                             type: string
 *                             example: "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21"
 *                           character_frequency_map:
 *                             type: object
 *                             additionalProperties:
 *                               type: integer
 *                             example:
 *                               m: 2
 *                               a: 2
 *                               d: 1
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 interpreted_query:
 *                   type: object
 *                   properties:
 *                     original:
 *                       type: string
 *                       example: "all single word palindromic strings"
 *                     parsed_filters:
 *                       type: object
 *                       properties:
 *                         word_count:
 *                           type: integer
 *                           example: 1
 *                         is_palindrome:
 *                           type: boolean
 *                           example: true
 *       '400':
 *         description: Bad Request - Unable to parse natural language query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to parse natural language query"
 *                 interpreted_query:
 *                   type: object
 *                   properties:
 *                     original:
 *                       type: string
 *                       example: "all single word palindromic strings"
 *                     parsed_filters:
 *                       type: object
 *                       example: {}
 *       '422':
 *         description: Unprocessable Entity - Query parsed but resulted in no matching strings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Query parsed but resulted in no matching strings"
 *                 interpreted_query:
 *                   type: object
 *                   properties:
 *                     original:
 *                       type: string
 *                       example: "all single word palindromic strings"
 *                     parsed_filters:
 *                       type: object
 *                       properties:
 *                         word_count:
 *                           type: integer
 *                           example: 1
 *                         is_palindrome:
 *                           type: boolean
 *                           example: true
 */

router.get("/strings/filter-by-natural-language", StringController.filterByNaturalLanguage);


/**
 * @openapi
 * /strings:
 *   post:
 *     summary: create a string analyzer
 *     tags: [""]
 *     description: Accepts a string, analyzes its properties, and stores the result. Returns the computed properties and metadata.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 example: "madam joy"
 *     responses:
 *       '201':
 *         description: String analyzed and stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "675de69072c8d66b8be2b8bea98fe5ce407ad42a633d2857f258b2142beec25c"
 *                 value:
 *                   type: string
 *                   example: "madam joy"
 *                 properties:
 *                   type: object
 *                   properties:
 *                     length:
 *                       type: integer
 *                       example: 9
 *                     is_palindrome:
 *                       type: boolean
 *                       example: false
 *                     unique_characters:
 *                       type: integer
 *                       example: 7
 *                     word_count:
 *                       type: integer
 *                       example: 2
 *                     sha256_hash:
 *                       type: string
 *                       example: "675de69072c8d66b8be2b8bea98fe5ce407ad42a633d2857f258b2142beec25c"
 *                     character_frequency_map:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         m: 2
 *                         a: 2
 *                         d: 1
 *                         " ": 1
 *                         j: 1
 *                         o: 1
 *                         y: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-20T17:51:37.983Z"
 *       '400':
 *         description: Bad Request - Missing or invalid "value" field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Missing "value" field in request body'
 *       '409':
 *         description: Conflict - String already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'String already exists'
 *       '422':
 *         description: Unprocessable Entity - "value" is not a string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: '"value" must be a string'
 */
router.post('/strings', StringController.create);


/**
 * @openapi
 * /strings/{string_value}:
 *   get:
 *     summary: Retrieve a specific analyzed string
 *     tags: [""]
 *     description: Returns the analysis and metadata for a string previously stored in the system.
 *     parameters:
 *       - name: string_value
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "madam"
 *     responses:
 *       '200':
 *         description: String found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21"
 *                 value:
 *                   type: string
 *                   example: "madam"
 *                 properties:
 *                   type: object
 *                   properties:
 *                     length:
 *                       type: integer
 *                       example: 5
 *                     is_palindrome:
 *                       type: boolean
 *                       example: true
 *                     unique_characters:
 *                       type: integer
 *                       example: 3
 *                     word_count:
 *                       type: integer
 *                       example: 1
 *                     sha256_hash:
 *                       type: string
 *                       example: "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21"
 *                     character_frequency_map:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         m: 2
 *                         a: 2
 *                         d: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-20T17:22:55.978Z"
 *       '404':
 *         description: String not found in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "String does not exist on this system"
 */
router.get('/strings/:string_value', StringController.getOne);

/**
 * @openapi
 * /strings:
 *   get:
 *     summary: Retrieve all strings with optional filters
 *     tags: [""]
 *     description: Returns a list of analyzed strings that match the provided query parameters.
 *     parameters:
 *       - name: word_count
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 3
 *       - name: is_palindrome
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example: false
 *       - name: min_length
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: max_length
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *       - name: contains-character
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 1
 *           example: "a"
 *     responses:
 *       '200':
 *         description: Matching strings returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cda8da05a7d978f116f43e7b4fa583f0808cc6d44a9642a2e40ab99346f915a7"
 *                       value:
 *                         type: string
 *                         example: "welcome to hng13"
 *                       properties:
 *                         type: object
 *                         properties:
 *                           length:
 *                             type: integer
 *                             example: 16
 *                           is_palindrome:
 *                             type: boolean
 *                             example: false
 *                           unique_characters:
 *                             type: integer
 *                             example: 13
 *                           word_count:
 *                             type: integer
 *                             example: 3
 *                           sha256_hash:
 *                             type: string
 *                             example: "cda8da05a7d978f116f43e7b4fa583f0808cc6d44a9642a2e40ab99346f915a7"
 *                           character_frequency_map:
 *                             type: object
 *                             additionalProperties:
 *                               type: integer
 *                             example:
 *                               w: 1
 *                               e: 2
 *                               l: 1
 *                               c: 1
 *                               o: 2
 *                               m: 1
 *                               " ": 2
 *                               t: 1
 *                               h: 1
 *                               n: 1
 *                               g: 1
 *                               1: 1
 *                               3: 1
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 filters_applied:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   example:
 *                     word_count: "3"
 *                     is_palindrome: "false"
 *                     min_length: "5"
 *                     max_length: "20"
 *                     contains-character: "a"
 *       '400':
 *         description: Bad Request - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameter: word_count must be a number"
 *       '404':
 *         description: No strings match the provided filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No strings found matching the provided filters"
 *                 filters_applied:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 */
router.get('/strings', StringController.getAll);


/**
 * @openapi
 * /strings/{string_value}:
 *   delete:
 *     summary: Delete a specific string from the system
 *     tags: [""]
 *     description: Removes a previously stored string and its associated properties using the original string value.
 *     parameters:
 *       - name: string_value
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "madam"
 *     responses:
 *       '204':
 *         description: String deleted successfully (no content returned)
 *       '404':
 *         description: String not found in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "String does not exist on this system"
 */
router.delete('/strings/:string_value', StringController.deleteOne);


export default router;
