import mongoose from "mongoose";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";
const organizationSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  userId:{
    type:String,
    required:true
  },
  orgName: {
    type: String,
    required: false,
  },
  isActive:{
    type:Boolean,
    default:true
  },
  address:{
    address1: {
      type: String,
      required: false,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    zipCode: {
      type: Number,
      required: false,
    }
  } 
},{timestamps:true});
let organization = mongoose.model("organization", organizationSchema);
export default organization;
