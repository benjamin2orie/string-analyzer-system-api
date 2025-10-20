
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";


@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: 'created_at' }, 
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        if (ret.created_at instanceof Date) {
          ret.created_at = ret.created_at.toISOString(); 
        }
        return ret;
      }
    }
  }
})
export class StringEntry {
    @prop({ required: true, unique: true })
    public value!: string;

    @prop({required:true})
    public properties!:{
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
    };

    public created_at?: Date;
}


const StringEntryModel = getModelForClass(StringEntry);

export default StringEntryModel;
    
