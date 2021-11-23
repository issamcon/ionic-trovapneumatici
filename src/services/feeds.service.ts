import Parser from "rss-parser";
import { FeedItem } from "@/models";
import { CorsAnyware } from "./corsanyware.service";

const FeedService = {

    loadFeedItems: async (): Promise<Array<FeedItem>> => {
        const feedsurl = ["https://www.gommeblog.it/feed"];
        const parser = new Parser();
        let result: FeedItem[] = [];


        //lettura in parrellelo dei feed
        await Promise.all(feedsurl.map(async (feedUrl) => {
            const returnFirstImage = (content: string): string => {
                const images = content.split(" ").filter((w: string) => { return w.endsWith('.jpg') || w.endsWith('.png') });
                return (images && images.length > 0 ? images[0].replace('srcset="', '') : '');
            };

            const response = await CorsAnyware.get(feedUrl);
            const feed = await parser.parseString(response);
            const items = feed.items.map(
                (i: any) =>
                    new FeedItem({
                        title: i.title,
                        source: feed.link,
                        content: i["content:encoded"],
                        link: i.link,
                        snippet: i.contentSnippet,
                        guid: i.guid,
                        date: i.isoDate,
                        imageUrl: returnFirstImage(i["content:encoded"]),
                    })
            );
            console.log("Articoli scaricati da ",feedUrl,": ",items.length);
            result = result.concat(items);
        }));

        console.log("Tot. articoli scaricati: "+ result.length);
        return result;
    }
}

export { FeedService }