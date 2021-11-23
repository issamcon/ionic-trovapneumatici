import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
//import axios, { AxiosRequestConfig } from 'axios'
import firebase from 'firebase/app';
import 'firebase/auth';
import { SearchFilter, ResultItem, AdditionalFilter, AlertSetting, AlertNotification, Click, FeedItem } from '@/models/index';
import { SizeService, AlertService, ClickService } from "@/services/product.service";
import { FeedService } from '@/services/feeds.service';
import { db } from "../main";

/*const axiosRequestConfig: AxiosRequestConfig = {
    headers: { "Access-Control-Allow-Origin": "*" }
};*/
// define your typings for the store state
export enum AuthMode {
    SignIn,
    SignUp,
}

export interface Authentication {
    user: firebase.User | null;
    nominativo: string | null;
    photoURL: string | null;
    isAuth: boolean;
    errorMsg: string;
    mode: AuthMode;
    dbUserId: number | null;
    requestUpdateApp: boolean;
    routeAfterSignIn: string | null;
}

export interface Platform {
    os: string;
    appVerNumber: string;
    appVerCode: string;
}

export interface AppSetting {
    lastIosVerCode: string;
    lastIosVerNum: string;
    lastAndroidVerCode: string;
    lastAndroidVerNum: string;
    iosAppId: string;
    androidAppId: string;
    forceUpdate: boolean;
}


export interface State {
    auth: Authentication | null;
    appSettings: AppSetting | null;
    currentLang: string;
    langs: Array<string>;
    lang: any;

    filter: SearchFilter | null;
    results: Array<ResultItem>;
    searchSuccess: boolean;
    searchResultsCount: number;
    searchResultMessage: string;

    current: ResultItem | null;
    myFavorites: Array<ResultItem>;
    mySearchs: Array<SearchFilter>;
    myAlerts: Array<AlertSetting>;
    myAlertNotifications: Array<AlertNotification>;
    additionalFilter: AdditionalFilter;

    feedItems: Array<FeedItem>;
}



// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        auth: {
            user: null,
            nominativo: null,
            photoURL: null,
            isAuth: false,
            errorMsg: '',
            mode: AuthMode.SignIn,
            dbUserId: null,
            requestUpdateApp: false,
            routeAfterSignIn: null
        },
        appSettings: null,
        currentLang: "it",
        lang: null,
        langs: ["it", "en"],

        filter: null,
        results: new Array<ResultItem>(),
        current: null,
        mySearchs: new Array<SearchFilter>(),
        myFavorites: new Array<ResultItem>(),
        myAlerts: new Array<AlertSetting>(),
        myAlertNotifications: new Array<AlertNotification>(),
        additionalFilter: {season:['S','W','A'], brandLevel:['P','M','E'], isChanged: false},
        searchSuccess: false,
        searchResultsCount: 0,
        searchResultMessage: "",

        feedItems: new Array<FeedItem>()
    },

    getters: {
        getFilter(state) {
            return state.filter;
        },
        getResults(state): Array<ResultItem> {
            return state.results;
        },
        getAuth(state): Authentication | null {
            return state.auth;
        },
        getAdditionalFilter(state): AdditionalFilter {
            return state.additionalFilter;
        },
        getAlertSettings(state): Array<AlertSetting> {
            return state.myAlerts;
        }
    },
    // ACTIONS (asynchronous)
    actions: {
        async setAuth({ commit, dispatch }, payload: any): Promise<void> {
            try {
                commit("setAuth", payload.user);

                if (!payload.user.isAnonymous) {
                    //caricamento dei favoriti
                    dispatch('getFavorites');
                    dispatch('loadAlerts');
                    dispatch('loadAlertNotifications');
                }
            }
            catch (ex) {
                console.log(ex);
                //commit("setFailAuth", ex.toString());
            }
        },
        setFailAuth({ commit }, payload: string) {
            commit("setFailAuth", payload);
        },

        setResults({ commit }, payload: Array<ResultItem>) {
            commit("setResults", payload);
        },
        setCurrentItem({ commit }, payload: ResultItem) {
            commit("setCurrentItem", payload);
        },

        setRouteAfterSignIn({ commit }, payload: string) {
            commit("setRouteAfterSignIn", payload);
        },
     

        async startAlert({commit, getters},payload: AlertSetting): Promise<boolean> {
            try {
                const auth = getters.getAuth;
                if (!auth)
                    throw Error("Not authenticated user.");
                payload.UserId = auth.user?.uid;
                payload.UserEmail = auth.user?.email;
                
                const result = await AlertService.registerAlert(payload);
                if (result){
                    commit('addAlertSetting', payload);
                }
                return result;
            }
            catch (ex) {
                console.log(ex);
                return false;
            }
        },

        async loadAlerts({commit, getters}): Promise<boolean> {
            try {
                const auth = getters.getAuth;
                if (!auth)
                    throw Error("Not authenticated user.");
                const result = await AlertService.getAlertSettingsForUser(auth.user?.uid);
                commit("setAlerts",result);
                return true;
            }
            catch (ex) {
                console.log(ex);
                return false;
            }
        },

        async loadAlertNotifications({commit, getters}): Promise<boolean> {
            try {
                const auth = getters.getAuth;
                if (!auth)
                    throw Error("Not authenticated user.");
                const result = await AlertService.getAlertNotificationsForUser(auth.user?.uid);
                commit("setAlertNotifications",result);
                return true;
            }
            catch (ex) {
                console.log(ex);
                return false;
            }
        },

        async stopAlert({commit, getters}, payload: number): Promise<boolean> {
            try {
                console.log("Requeste stop alert for ItemId: ", payload);
                const auth = getters.getAuth;
                if (!auth)
                    throw Error("Not authenticated user.");
                const myAlerts = await getters.getAlertSettings;
                const filtered = myAlerts.filter( (i: AlertSetting) => {return i.TyreId === payload});
                //const filtered = JSON.parse(JSON.stringify(proxy));
                console.log(filtered);
                if (filtered && filtered[0])
                {
                    const result = await AlertService.stopAlert(filtered[0].Id);
                    if (result)
                        commit('removeAlertSetting', payload);
                    return result;
                }
                else{
                    console.log("Itemid non presente tra gli Alerts")
                    return false;
                }
            }
            catch (ex) {
                console.log(ex);
                return false;
            }
        },

        async searchProducts({ commit }, payload: any): Promise<boolean> {
            commit("setFilter", payload);
            try {
                const result = await SizeService.getTyresWithCache(payload.w, payload.h, payload.d,"","ALL", payload.pageNum, payload.pageSize);
                commit("setResults", result);
                return true;
            }
            catch (ex) {
                console.log(ex);
                commit("setSearchError", "Fallita APi filter " + ex);
                return false;
            }
        },

        async loadOtherResults({ commit, getters }): Promise<boolean> {
            const filter = getters.getFilter;
            filter.pageNum = filter.pageNum + 1;
            commit("setFilter", filter);
            
            const additionalFilter = getters.getAdditionalFilter;
            const season = ""+additionalFilter.season;
            const brand = ""+additionalFilter.brandLevel;
            
            const results = getters.getResults;

            try {
                const pageResult = await SizeService.getTyresWithCache(filter.w, filter.h, filter.d,season, brand, filter.pageNum, filter.pageSize);
                if (pageResult.length > 0){
                    commit("setResults", results.concat(pageResult));
                    return true;
                }
                else
                    return false;
            }
            catch (ex) {
                commit("setSearchError", "Fallita APi filter " + ex);
                return false;
            }
        },


        async selectDetail({ commit, getters }, payload: number): Promise<boolean> {
            try {

                const results = getters.getResults;
                const detail = results.filter((i: ResultItem) => {
                    return i.ItemId == payload;
                });

                if (!detail || detail.length == 0)
                    throw new Error("Item non trovato, Id: " + payload);

                commit("setCurrentItem", detail[0]);
                return true;
            }
            catch (ex) {
                commit("setSearchError", "Errore nel recupero delle info: " + ex);
                return false;
            }
        },

        async getFavorites({commit, getters}): Promise<boolean>
        {
            try{
                const auth = getters.getAuth;
                if (auth && auth.user && auth.user?.uid) {
                    const doc = await db.collection("users").doc(auth.user?.uid).get();
                    if (doc) {
                        const favorites = doc.get('favorites');
                        if (favorites && favorites.length > 0) {
                            const items = await SizeService.getTyresByItemIds(""+favorites);
                            commit("setFavorites", items);
                            return true;
                        }
                    }
                }
                const items = new Array<ResultItem>();
                commit("setFavorites", items);
                return true;
            }
            catch(ex)
            {
                const items = new Array<ResultItem>();
                commit("setFavorites", items);
                return false;
            }
        },

        async addToFavorites({ commit, getters }, payload: number): Promise<boolean> {
            console.log('addToFavorites - store.action')
            try {
                const auth = getters.getAuth;
                if (auth && auth.user && auth.user?.uid) 
                {
                    const doc = await db.collection("users").doc(auth.user?.uid).get();
                    let favorites = new Array<number>();
                    if (doc) {
                        favorites = doc.get('favorites');
                        if (!favorites)
                            favorites = new Array<number>();
                        else
                            favorites = favorites.filter((i: number) => {
                                return i !== payload
                            });
                    }
                    favorites.push(payload);
                    
                    //Max 10 favoriti per utente
                    while (favorites.length > 10)
                        favorites.shift();

                    await db.collection("users").doc(auth.user?.uid).set({
                        favorites: favorites
                    });

                    const items = await SizeService.getTyresByItemIds(""+favorites);
                    commit("setFavorites", items);
                    return true;
                }   
                return true;
            }
            catch (ex) {
                console.log('Exception',ex);
                return false;
            }
        },

        async removeFromFavorites({ commit, getters }, payload: number): Promise<boolean> {
            try {
                const auth = getters.getAuth;
                if (auth && auth.user && auth.user?.uid) {
                    const doc = await db.collection("users").doc(auth.user?.uid).get();
                    if (doc) {
                        let favorites = doc.get('favorites');
                        if (favorites) {
                            favorites = favorites.filter((i: number) => {
                                return i !== payload
                            });
                            await db.collection("users").doc(auth.user?.uid).set({
                                favorites: favorites
                            });

                            const items = await SizeService.getTyresByItemIds(""+favorites);
                            commit("setFavorites", items);
                            return true;
                        }
                    }
                }
                return true;
            }
            catch (ex) {
                console.log('Exception removeFromFavorites',ex);
                return false;
            }
        },

        toggleSeason({commit, getters}, payload: string): void {
            try{
            const filter = getters.getAdditionalFilter;
            let filterSeason = filter.season;
            if (filterSeason.indexOf(payload) !== -1)
            {
                filterSeason = filterSeason.filter( (i: string) => {
                    return i !== payload;
                });
                
            }
            else {
                filterSeason.push(payload);
            }
            commit("setAdditionFilterSeason", filterSeason);
            }
            catch(ex){
                console.log('Error toggleSeason', ex);
            }
        },

        toggleBrandLevel({commit, getters}, payload: string): void {
            try{
            const filter = getters.getAdditionalFilter;
            let filterBrand = filter.brandLevel;
            if (filterBrand.indexOf(payload) !== -1)
            {
                filterBrand = filterBrand.filter( (i: string) => {
                    return i !== payload;
                });
            }
            else {
                filterBrand.push(payload);
            }
            commit("setAdditionFilterBrandLevel", filterBrand);
            }
            catch(ex){
                console.log('Error toggleSeason', ex);
            }
        },
        
        async applyAdditionalFilter({commit, getters}): Promise<boolean> {
            try {
                //renizializzo la ricerca
                const additionalFilter = getters.getAdditionalFilter;
                const filter = getters.getFilter;
                filter.pageNum = 1;
                commit("setFilter", filter);
                
                const season = ""+additionalFilter.season;
                const brand = ""+additionalFilter.brandLevel;
                const result = await SizeService.getTyresWithCache(filter.w, filter.h, filter.d, season, brand, filter.pageNum, filter.pageSize);
                commit("setResults", result);
                return true;
            }
            catch (ex) {
                console.log(ex);
                commit("setSearchError", "Fallita APi filter " + ex);
                return false;
            }
        },

        async loadAppSettings({ commit }): Promise<boolean> {
           
            try{
                const doc = await db.collection("settings").doc("appVersion").get();
                    if (doc) {
                        const s: AppSetting = {
                            androidAppId: doc.get('androidAppId'),
                            iosAppId: doc.get('iosAppId'),
                            lastIosVerNum: doc.get('lastIosVerNum'),
                            lastIosVerCode: doc.get('lastIosVerCode'),
                            lastAndroidVerNum: doc.get('lastAndroidVerNum'),
                            lastAndroidVerCode: doc.get('lastAndroidVerCode'),
                            forceUpdate: doc.get('forceUpdete')
                        }
                
                        commit("setAppSetting", s);
                        return true;                       
                    }
                
                console.log('app.setting non presenti');
                return false;
            }
            catch(ex)
            {
                console.log('Err. recupero app.settings: ', ex);
                return false;
            }
        },

        async registerClick({getters}, payload: Click): Promise<boolean> {
            try{
                const auth = getters.getAuth;
                if (auth && auth.user && auth.user.email)
                    payload.UserId = auth.user.email;
                else if (auth && auth.user)
                    payload.UserId = auth.user.uid;
                else
                    payload.UserId = "unknowed";
                return await ClickService.registerClick(payload);
            }
            catch(ex)
            {
                console.log('Err. registrazione click: ', ex);
                return false;
            }
        },

        async loadFeeds({commit}): Promise<boolean>{
            try{
                const result = await FeedService.loadFeedItems();
                commit("setFeedItems", result);
                return true;
            }
            catch(ex)
            {
                console.log('Err. loading feeds: ', ex);
                return false;
            }
        },
        
        selectLang({ commit }, payload: string): void {
            commit("setLang", payload);
        },

        resetUser({ commit }): void {
            commit("resetUser");
        }
    },

    // MUTATIONS ( set the state )
    mutations: {
        setAuth(state: any, user: any) {
            state.auth.user = user;
            state.auth.isAuth = true;
            state.auth.errorMsg = "";
            state.auth.mode = AuthMode.SignIn;
        },
        setDbUser(state: any, appUser: any) {
            state.auth.dbUserId = appUser.id;
            state.auth.photoURL = appUser.photoUrl;
            state.auth.nominativo = appUser.nominativo;
        },
        setRequestUpdate(state: any, update: boolean) {
            state.auth.requestUpdateApp = update;
        },
        setFailAuth(state: any, error: string) {
            state.auth.user = null;
            state.auth.isAuth = false;
            state.auth.errorMsg = error;
            state.auth.dbUserId = null;
        },
        setFilter(state: any, filter: SearchFilter) {
            state.filter = filter;
            
        },
        
        setResults(state: any, results: Array<ResultItem>) {
            state.results = results;
            state.searchSuccess = true;
            state.searchResultsCount = results.length;
            state.searchResultMessage = "";
            state.additionalFilter.isChanged = false;
        },
        setFavorites(state: any, results: Array<ResultItem>) {
            state.myFavorites = results;
        },
        
        setSearchError(state: any, error: string) {
            state.results = [];
            state.searchSuccess = false;
            state.searchResultsCount = 0;
            state.searchResultMessage = error;
        },
        setCurrentItem(state: any, current: ResultItem) {
            state.current = current;
        },

        setCimiteri(state: any, payload: Array<any>) {
            state.cimiteri = payload;
        },

        setMieiDefunti(state: any, payload: Array<any>) {
            state.mieiDefunti = payload;
        },

        setLang(state: any, payload: string) {
            state.currentLang = payload;
            if (payload === "it") {
                state.lang = require('/public/assets/lang/it.json');
            }
            else {
                state.lang = require('/public/assets/lang/en.json');
            }
        },

        resetUser(state: any) {
            state.auth = {
                user: null,
                isAuth: false,
                nominativo: null,
                photoURL: null,
                errorMsg: '',
                mode: AuthMode.SignIn,
                dbUserId: null,
                routeAfterSignIn: null
            };
            state.mieiDefunti = [];
        },

        setRouteAfterSignIn(state: any, payload: string) {
            state.auth.routeAfterSignIn = payload;
        },

        setAppSetting(state: any, payload: AppSetting) {
            state.appSettings = payload;
        },

        addToFavorites(state: any, payload: number) {
            state.myFavorites.push(payload);
        },

        removeFromFavorites(state: any, payload: number) {
            state.myFavorites = state.myFavorites.filter((i: number) => {
                return i !== payload
            });
        },

        setAdditionFilterSeason(state: any, payload: Array<string>) {
            state.additionalFilter.season = payload;
            state.additionalFilter.isChanged = true;
        },

        setAdditionFilterBrandLevel(state: any, payload: Array<string>) {
            state.additionalFilter.brandLevel = payload;
            state.additionalFilter.isChanged = true;
        },

        resetAdditionalFilter(state: any) {
            state.additionalFilter.season = ['S','W','A'];
            state.additionalFilter.brandLevel = ['P','M','E']
            state.additionalFilter.isChanged = false;
        },

        setAlerts(state: any, payload: Array<AlertSetting>) {
            if (payload && payload.length > 0)
                state.myAlerts = payload;
            else
                state.myAlerts = [];
        },

        setAlertNotifications(state: any, payload: Array<AlertNotification>) {
            if (payload && payload.length > 0)
                state.myAlertNotifications = payload;
            else
                state.myAlertNotifications = [];
        },

        addAlertSetting(state: any, payload: AlertSetting){
            state.myAlerts.push(payload);
        },

        removeAlertSetting(state: any, payload: AlertSetting){
            state.myAlerts = state.myAlerts.filter( (i: AlertSetting) => {
                return i.Id !== payload.Id
            });
        },

        setFeedItems(state: any, payload: Array<FeedItem>){
            state.feedItems = payload;
        }
    }
});
//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//


