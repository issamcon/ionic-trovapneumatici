import axios from "axios";
import { ResultItem, AlertSetting, AlertNotification, Click } from "@/models/index";

/*const axiosRequestConfig: AxiosRequestConfig = {
    headers: { "Access-Control-Allow-Origin": "*" }
};*/
const data = new Map();

const SizeService = {

    cache: {
        pageSize: 100,
        addData(key: string, results: Array<ResultItem>): void {
            if (data.has(key)) {
                data.set(key, data.get(key).concat(results));
            }
            else {
                data.set(key, results);
            }
        },
        getData(key: string, pageNum: number, pageSize: number): Array<ResultItem> {
            const fromIndex = (pageNum - 1) * pageSize;
            const toIndex = fromIndex + pageSize;

            if (!data.has(key))
                return new Array<ResultItem>();
            else
                return data.get(key).slice(fromIndex, toIndex);


        },
        getNextPageToLoad(key: string): number | null {
            if (!data.has(key) || data.get(key).length == 0)
                return 1;
            else if (data.get(key).length < this.pageSize)
                return null;
            else
                return (~~(data.get(key).length / this.pageSize)) + 1;
        },
        reset(key: string){
            if (data.has(key)) {
                data.delete(key);
                console.log("Reset cache key ", key);
            }
        }
    },

    async getLarghezze(tipo: string) {
        let url = "https://dev.trovapneumatici.it/api/GetTyreWidths";
        if (tipo != undefined && tipo != "")
            url = url + "?category=" + tipo;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success") {
            return response.data.result;
        }
        else
            return [];
    },

    async getAltezze(width: string) {
        const url = "https://dev.trovapneumatici.it/api/GetTyreHights?w=" + width;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success")
            return response.data.result;
        else
            return [];
    },

    async getDiametri(width: string, height: string) {
        const url = "https://dev.trovapneumatici.it/api/GetTyreDiameters?w=" + width + "&h=" + height;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success")
            return response.data.result;
        else
            return [];
    },

    async getTyres(width: string, height: string, diameter: string, page: number | null, pageSize: number | null): Promise<ResultItem[]> {
        const url = "https://dev.trovapneumatici.it/api/GetTyres?w=" + width + "&h=" + height + "&d=" + diameter + "&pageNum=" + (page ?? 1) + "&pageSize=" + (pageSize ?? 12);
        //console.log(url);
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success")
            return response.data.result;
        else
            return [];
    },

    async loadTyresForNextFrame(width: string, height: string, diameter: string, season = "", brandLevel = "ALL"): Promise<void> {
        const key = width + height + diameter;
        const nextPage = this.cache.getNextPageToLoad(key);
        if (nextPage) {
            const url = "https://dev.trovapneumatici.it/api/GetTyres?w=" + width + "&h=" + height + "&d=" + diameter + "&season=" + season +"&brandLevel=" + brandLevel +"&pageNum=" + (nextPage) + "&pageSize=" + (this.cache.pageSize);
            //console.log(url);
            const response = await axios.get(url);
            if (response.status < 300 && response.data.status == "success") {
                this.cache.addData(key, response.data.result);
            }
            console.log('Loaded data for key ', key, 'page', nextPage);
        }
        else {
            console.log("There isn't other pages");
        }
    },

    async getTyresWithCache(width: string, height: string, diameter: string, season = "", brandLevel = "ALL", page: number | null, pageSize: number | null): Promise<ResultItem[]> {
        const key = width + height + diameter;
        if (page == 1)
            this.cache.reset(key);
        const results = this.cache.getData(key, page ?? 1, pageSize ?? 12);
        if (results.length > 0) {
            const nextPage = this.cache.getNextPageToLoad(key);
            if (nextPage) {
                const currentLoaded = ((nextPage-1) * this.cache.pageSize);
                const lastIndexRequest = ((page ?? 1) - 1) * (pageSize ?? 12);
                console.log("Attualmente caricati ", currentLoaded," - Elemento richiesto ", lastIndexRequest);
                if ( currentLoaded - lastIndexRequest <= 2 * (pageSize ?? 12))
                    this.loadTyresForNextFrame(width, height, diameter,season, brandLevel);
            }
            return results;
        }
        await this.loadTyresForNextFrame(width, height, diameter,season, brandLevel);
        return this.cache.getData(key, page ?? 1, pageSize ?? 12);
    },



    async getTyresByItemIds(ids: string): Promise<ResultItem[]> {
        const url = "https://dev.trovapneumatici.it/api/GetTyresByItemIds?ids=" + ids;
        //console.log(url);
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success")
            return response.data.result;
        else
            return [];
    },

};

const AlertService = {

    async getAlertSettingsForUser(userid: string): Promise<Array<AlertSetting>> {
        const url = "https://dev.trovapneumatici.it/api/GetAlertSettingsByUser?userId="+userid;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success") {
            return response.data.results;
        }
        else
            return [];
    },

    async getAlertNotificationsForUser(userid: string): Promise<Array<AlertNotification>> {
        const url = "https://dev.trovapneumatici.it/api/GetAlertNotificationsByUser?userId="+userid;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success") {
            return response.data.results;
        }
        else
            return [];
    },

    async registerAlert(alert: AlertSetting): Promise<boolean> {
        const url = "https://dev.trovapneumatici.it/api/AddAlert"
        const postData = {
            UserId: alert.UserId,
            UserEmail: alert.UserEmail,
            TyreId: alert.TyreId,
            StartPrice: alert.StartPrice,
            NotifyAllChanges: alert.NotifyAllChanges,
            DesiredPrice: alert.DesiredPrice,
            AutodisablingDays: alert.AutodisablingDays
        }
        const response = await axios.post(url, postData);
        if (response.status < 300 && response.data.status == "success") {
            console.log('Alert registrato con successo');
            return true;        
        }
        else{
            console.log('Alert NON registrato');
            return false;
        }
    },

    async stopAlert(alertId: number): Promise<boolean> {
        
        const url = "https://dev.trovapneumatici.it/api/StopNoticationAlert?alertId="+alertId;
        const response = await axios.get(url);
        if (response.status < 300 && response.data.status == "success") {
            return true
        }
        else
            return false;
    }
}

const ClickService = {
    async registerClick(click: Click): Promise<boolean> {
        const url = "https://dev.trovapneumatici.it/api/AddClick"
        console.log(click);
        const response = await axios.post(url, click);
    
        if (response.status < 300 && response.data.status == "success") {
            console.log('Click registrato con successo');
            return true;        
        }
        else{
            console.log('Click NON registrato');
            return false;
        }
    },
}


export { SizeService, AlertService, ClickService }