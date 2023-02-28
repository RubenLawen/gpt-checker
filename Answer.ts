import { Configuration, OpenAIApi } from "openai";

export default class Answer
{
    private answer: string;
    private key: string;
    private compare: string;
    private taux: number;
    private multipleAnswer: string[];
    
    constructor(ans: string, k: string, comp: string = "") {
        this.answer = ans;
        this.key = k;
        this.compare = comp;
        this.taux = 0;
        this.multipleAnswer = []
    }

    public async setRepons(arr: string[]){
        this.multipleAnswer = arr;
        return this.multipleAnswer;
    } 

    public async getRequest(){
        const configuration = new Configuration({
            apiKey: this.key,
        });  
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: this.answer,
            temperature: 1,
            max_tokens: 750,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 0,
        });
        return response.data.choices[0].text?.replace(/\n/g, "")
    }

    public async getMultipleRequests(loop: number){
        for(let i = 0; i < loop; i++){
            this.multipleAnswer.push((await this.getRequest())!);
        }
        return this.multipleAnswer;
    }

    public async compareTexte(arr: string[], toCompare: string){
        
        this.compare = toCompare;
        let allSplitedWithoutDouble: string[] = [];
        let allSpliteTocompareWithoutDouble: string[] = [];

        for(let i = 0; i < toCompare.split(" ").length; i++){
            if(!allSpliteTocompareWithoutDouble.includes(toCompare.split(" ")[i].toLowerCase())) allSpliteTocompareWithoutDouble.push(toCompare.split(" ")[i].toLowerCase())
        }

        for(let i = 0; i < arr.length; i++){
            arr[i].split(" ").forEach( ( el )=>{
                if(!allSplitedWithoutDouble.includes(el.toLowerCase())) allSplitedWithoutDouble.push(el.toLowerCase())
            })
        }
        
        for(let a = 0; a < allSpliteTocompareWithoutDouble.length; a++){
            for(let i = 0; i < allSplitedWithoutDouble.length; i++){
                if(allSplitedWithoutDouble[i] == allSpliteTocompareWithoutDouble[a]) this.taux++
            }
        }

        this.taux = Math.round(this.taux * 100 / allSpliteTocompareWithoutDouble.length * 10) / 10;

        return this.taux;

    }

}