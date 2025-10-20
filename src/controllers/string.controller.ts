
import type { Response, Request } from "express";
import StringEntryModel from "../model/string.entry.js";
import { analyzeString, parseNaturalLanguageQuery } from "../utils/analyzer.string.js";




export class StringController {
    static async create(req: Request, res: Response): Promise<any> {
        const { value } = req.body;
        try {

            if(value === undefined){
                return  res.status(400).json({error: "Invalid request body or missing value field"});
            }
            if(typeof value !== 'string'){
                return res.status(422).json({error: "Invalid data type for value (must be string)"});
            };
            const existingEntity = await StringEntryModel.findOne({value});
            if(existingEntity){
                return res.status(409).json({error: "String already exists in the system"});
            };



            const properties = analyzeString(value);
            const entry = await StringEntryModel.create({value, properties});

            res.status(201).json({
                id:properties.sha256_hash,
                value,
                properties,
                created_at:entry.created_at?.toISOString(),
            })
        } catch (error) {
            console.error('Error creating string entry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async filterByNaturalLanguage(req: Request, res: Response) {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid query parameter' });
        }

        const { filters, error } = parseNaturalLanguageQuery(query);
        if (error) {
            return res.status(400).json({ error, interpreted_query: { original: query, parsed_filters: {} } });
        }

        const mongoFilters: any = {};

        try{

        if (filters.is_palindrome !== undefined) mongoFilters['properties.is_palindrome'] = filters.is_palindrome;
        if (filters.word_count !== undefined) mongoFilters['properties.word_count'] = filters.word_count;
        if (filters.min_length !== undefined) mongoFilters['properties.length'] = { $gte: filters.min_length };
        if (filters.contains_character !== undefined) mongoFilters['value'] = new RegExp(filters.contains_character, 'i');

        const data = await StringEntryModel.find(mongoFilters);

        if (data.length === 0) {
            return res.status(422).json({
            error: 'Query parsed but resulted in no matching strings',
            interpreted_query: {
                original: query,
                parsed_filters: filters,
            },
            });
        }

        res.status(200).json({
            data: data.map(entry => ({
            id: entry.properties.sha256_hash,
            value: entry.value,
            properties: entry.properties,
            created_at: entry.created_at?.toISOString(),
            })),
            count: data.length,
            interpreted_query: {
            original: query,
            parsed_filters: filters,
            },
        });
     } catch(error){
        console.error("Something went wrong")
        res.status(500).json({error:"internal server error"});
     }
    }

    
    static async getOne(req:Request, res:Response): Promise<any>{
        const {string_value } = req.params;
        try {
            const entry = await StringEntryModel.findOne({value: string_value});
            if(!entry){
                return res.status(404).json({error: "String does not exist in the systemsddd"});
            };

            res.status(200).json({
                id:entry.properties.sha256_hash,
                value: entry.value,
                properties: entry.properties,
                created_at:entry.created_at?.toISOString(),
            })
        } catch (error) {
            console.error('Error fetching string entry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async getAll(req: Request, res: Response) {
      const {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
        } = req.query;

      const filters: any = {};

     // Validate types
       try{
            if (is_palindrome !== undefined && is_palindrome !== 'true' && is_palindrome !== 'false') {
                return res.status(400).json({ error: 'Invalid query parameter: is_palindrome must be true or false' });
            }

            if (min_length !== undefined && isNaN(Number(min_length))) {
                return res.status(400).json({ error: 'Invalid query parameter: min_length must be a number' });
            }

            if (max_length !== undefined && isNaN(Number(max_length))) {
                return res.status(400).json({ error: 'Invalid query parameter: max_length must be a number' });
            }

            if (word_count !== undefined && isNaN(Number(word_count))) {
                return res.status(400).json({ error: 'Invalid query parameter: word_count must be a number' });
            }

            if (contains_character !== undefined && typeof contains_character !== 'string') {
                return res.status(400).json({ error: 'Invalid query parameter: contains_character must be a string' });
            }

            // Apply filters
            if (is_palindrome !== undefined) filters['properties.is_palindrome'] = is_palindrome === 'true';
            if (word_count) filters['properties.word_count'] = Number(word_count);
            if (min_length || max_length) {
                filters['properties.length'] = {};
                if (min_length) filters['properties.length'].$gte = Number(min_length);
                if (max_length) filters['properties.length'].$lte = Number(max_length);
            }
            if (contains_character) filters['value'] = new RegExp(contains_character as string, 'i');

            const data = await StringEntryModel.find(filters);

            if(data.length === 0){
                return res.status(400).json({
                    error:"Invalid query parameter values or types",
                })
            }
            res.json({
                data: data.map(entry => ({
                id: entry.properties.sha256_hash,
                value: entry.value,
                properties: entry.properties,
                created_at: entry.created_at?.toISOString(),
                })),
                count: data.length,
                filters_applied: req.query,
            });
        } catch(error){
            console.error('server error', error)
            res.status(500).json({error:"Internal server error"})
        }
   }

    static async deleteOne(req:Request, res:Response): Promise<any>{
        const {string_value} = req.params;
        try{
            const entry = await StringEntryModel.findOneAndDelete({value: string_value});
            if(!entry){
                return res.status(404).json({error: "String does not exist in the system"});
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting string entry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

//    static async filterByNaturalLanguage(req: Request, res: Response) {
//         const { query } = req.query;
//         if (!query || typeof query !== 'string') {
//             return res.status(400).json({ error: 'Missing or invalid query parameter' });
//         }

//         const { filters, error } = parseNaturalLanguageQuery(query);
//         if (error) {
//             return res.status(400).json({ error, interpreted_query: { original: query, parsed_filters: {} } });
//         }

//         const mongoFilters: any = {};

//         try{

//         if (filters.is_palindrome !== undefined) mongoFilters['properties.is_palindrome'] = filters.is_palindrome;
//         if (filters.word_count !== undefined) mongoFilters['properties.word_count'] = filters.word_count;
//         if (filters.min_length !== undefined) mongoFilters['properties.length'] = { $gte: filters.min_length };
//         if (filters.contains_character !== undefined) mongoFilters['value'] = new RegExp(filters.contains_character, 'i');

//         const data = await StringEntryModel.find(mongoFilters);

//         if (data.length === 0) {
//             return res.status(422).json({
//             error: 'Query parsed but resulted in no matching strings',
//             interpreted_query: {
//                 original: query,
//                 parsed_filters: filters,
//             },
//             });
//         }

//         res.status(200).json({
//             data: data.map(entry => ({
//             id: entry.properties.sha256_hash,
//             value: entry.value,
//             properties: entry.properties,
//             created_at: entry.created_at?.toISOString(),
//             })),
//             count: data.length,
//             interpreted_query: {
//             original: query,
//             parsed_filters: filters,
//             },
//         });
//      } catch(error){
//         console.error("Something went wrong")
//         res.status(500).json({error:"internal server error"});
//      }
//     }


}