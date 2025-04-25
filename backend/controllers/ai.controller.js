import * as ai from "../services/ai.service.js";

export const getResult = async (req,res)=>{
    try{
        console.log(req.body);
        console.log("req recieved")
        const {prompt} = req.query;
        console.log("prompt: ", prompt);
        const result = await ai.generateResult(prompt);
        console.log("result: ", result);
        res.send(result);

    }catch(err){
        console.error(err);
        res.status(500).send({error: err.message});
        

    }
}