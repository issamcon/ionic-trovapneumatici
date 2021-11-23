import { IResultItem } from "@/models/index";
import { SizeService } from "@/services/product.service";


const BusinessLogic = {

    async doSearch(width: string, height: string, diameter: string): Promise<IResultItem[]> 
    {       
        const products = SizeService.getTyres(width, height, diameter);
        return products;
    },

}

export { BusinessLogic}