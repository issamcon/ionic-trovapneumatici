import axios from "axios";

const CorsAnyware = {

    
    async get(url: string): Promise<string> {
        const CORS_PROXY = "https://api.allorigins.win/get?url=";

        const response = await axios.get(CORS_PROXY+url);
        //console.log(response);
          if (response.status < 300)
            return response.data.contents;
            else
            return "";
    },

};


export { CorsAnyware }